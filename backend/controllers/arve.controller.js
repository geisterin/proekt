const { Arve, Tellimus, Klient, TellimuseStaatused } = require('../models');

// ✅ Клиент получает счёт по заказу
exports.getInvoiceByOrder = async (req, res) => {
  try {
    const { tellimusId } = req.params;

    const invoice = await Arve.findOne({
      where: { tellimus_id: tellimusId },
      include: [{
        model: Tellimus,
        as: 'Tellimus',
        attributes: ['klient_id']
      }]
    });
    console.log('DEBUG invoice:', JSON.stringify(invoice, null, 2));

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for this order' });
    }

    // Проверка доступа клиента
    if (req.user.userType === 'klient' && invoice.Tellimus?.klient_id !== req.user.id) {
      return res.status(403).json({ message: 'Нет доступа к чужому счёту' });
    }

    res.json(invoice);
  } catch (err) {
    console.error('Ошибка при получении счёта:', err);
    res.status(500).json({ message: 'Ошибка при получении счёта', error: err.message });
  }
};

// ✅ Клиент оплачивает счёт
exports.payInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { summa } = req.body;

    const invoice = await Arve.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const totalSum = parseFloat(invoice.summa);
    const currentEttemaks = parseFloat(invoice.ettemaks || 0);
    const payment = parseFloat(summa);

    const newEttemaks = currentEttemaks + payment;
    const remaining = totalSum - newEttemaks;

    if (payment <= 0) {
      return res.status(400).json({ message: 'Сумма оплаты должна быть положительной' });
    }

    if (newEttemaks > totalSum) {
      return res.status(400).json({ message: 'Сумма оплаты превышает общую сумму счета' });
    }

    invoice.ettemaks = newEttemaks;
    invoice.makse_kuupaev = new Date();
    await invoice.save();

    // Если всё оплачено — добавить статус "taidetud"
    if (remaining <= 0) {
      await TellimuseStaatused.create({
        tellimus_id: invoice.tellimus_id,
        staatus: 'taidetud',
        kuupaev: new Date()
      });
    }

    res.json({
      message: 'Invoice paid',
      invoice: {
        arve_id: invoice.arve_id,
        tellimus_id: invoice.tellimus_id,
        makse_kuupaev: invoice.makse_kuupaev,
        summa: totalSum.toFixed(2),
        ettemaks: newEttemaks.toFixed(2),
        remaining: remaining.toFixed(2)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при оплате счета', error: err.message });
  }
};

// ✅ Менеджер/продавец видит все счета
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Arve.findAll({ order: [['arve_id', 'DESC']] });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};

// ✅ Менеджер/продавец видит счета по заказу
exports.getInvoicesByOrderForManager = async (req, res) => {
  try {
    const { tellimusId } = req.params;

    const invoices = await Arve.findAll({
      where: { tellimus_id: tellimusId },
      include: [
        {
          model: Tellimus,
          include: [{ model: Klient, attributes: ['nimi', 'email'] }]
        }
      ],
      order: [['makse_kuupaev', 'DESC']]
    });

    if (!invoices.length) {
      return res.status(404).json({ message: 'No invoices found for this order' });
    }

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get invoices for order', error: err.message });
  }
};
