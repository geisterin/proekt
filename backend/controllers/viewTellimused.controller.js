const { ViewTellimused } = require('../models');

//  Для клиента — его собственные заказы
exports.getMyOrdersWithPayments = async (req, res) => {
  try {
    if (req.user.userType !== 'klient') {
      return res.status(403).json({ message: 'Доступ только для клиентов' });
    }

    const result = await ViewTellimused.findAll({
      where: { klient_id: req.user.id },
      order: [['tellimuse_kuupaev', 'DESC']]
    });

    res.json(result);
  } catch (err) {
    console.error('Ошибка клиента при получении заказов:', err.message);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// ля менеджеров — все заказы
exports.getAllOrdersForManagers = async (req, res) => {
  try {
    const result = await ViewTellimused.findAll({
      order: [['tellimuse_kuupaev', 'DESC']]
    });

    res.json(result);
  } catch (err) {
    console.error('Ошибка менеджера при получении заказов:', err.message);
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};
