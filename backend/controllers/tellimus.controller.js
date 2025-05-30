const {
  Tellimus,
  Klient,
  Tootaja,
  TellimuseStaatused,
  Arve,
  ToodeteList,
  TeenusedList,
  Toode,
  Teenused,
  ToodeHinnad
} = require('../models');

// чоздать новый заказ 

exports.createOrder = async (req, res) => {
  const { kuu_arv, tooted = [], teenused = [] } = req.body || {};

  if (!kuu_arv) {
    return res.status(400).json({ message: 'Missing kuu_arv in request body' });
  }
  
  const klient_id = req.user.id;

  try {
    // Создание нового заказа
    const newOrder = await Tellimus.create({
      klient_id,
      kuu_arv,
      tellimuse_kuupaev: new Date()
    });

    let totalSum = 0;

    await TellimuseStaatused.create({
      tellimus_id: newOrder.tellimus_id,
      staatus: 'esitatud',
      kuupaev: new Date()
    });
    

    // === Добавление товаров ===
    const tootedPromises = tooted.map(async (item) => {
      const latestHind = await ToodeHinnad.findOne({
        where: { toode_id: item.toode_id },
        order: [['kuupaev', 'DESC']]
      });

      if (!latestHind) {
        console.warn(`Нет цены для товара ID: ${item.toode_id}`);
        return null;
      }

      totalSum += parseFloat(latestHind.hind) * item.arv;

      return ToodeteList.create({
        tellimus_id: newOrder.tellimus_id,
        toode_id: item.toode_id,
        arv: item.arv
      });
    });

    await Promise.all(tootedPromises);

    // === Добавление услуг ===
    const teenusedPromises = teenused.map(async (service) => {
      const teenus = await Teenused.findByPk(service.teenused_id);
      if (!teenus) {
        console.warn(`Услуга не найдена: ID ${service.teenused_id}`);
        return null;
      }

      totalSum += parseFloat(teenus.hind) * service.arv;

      return TeenusedList.create({
        tellimus_id: newOrder.tellimus_id,
        teenused_id: service.teenused_id,
        arv: service.arv
      });
    });

    await Promise.all(teenusedPromises);

    // === Создание счёта ===
    await Arve.create({
      tellimus_id: newOrder.tellimus_id,
      summa: totalSum
    });

    // === Ответ ===
    res.status(201).json({
      message: 'Заказ и счёт успешно созданы',
      tellimus_id: newOrder.tellimus_id,
      summa: totalSum.toFixed(2)
    });

  } catch (err) {
    console.error('Ошибка при создании заказа:', err);
    res.status(500).json({
      message: 'Ошибка при создании заказа',
      error: err.message
    });
  }
};


// посмотреть заказы

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Tellimus.findAll({
      where: { klient_id: req.user.klient_id }, // ⬅️ используем клиентский ID
      order: [['tellimuse_kuupaev', 'DESC']]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    if (!['Manager', 'SalesManager'].includes(req.user.roll)) {
      return res.status(403).json({ message: 'Only managers can view all orders' });
    }

    const orders = await Tellimus.findAll({
      order: [['tellimus_id', 'DESC']],
      include: [
        { model: Klient, attributes: ['nimi'] },
        { model: Arve, attributes: ['summa'] }
      ]
    });

    const formatted = orders.map(order => ({
      tellimus_id: order.tellimus_id,
      klient: order.Klient.nimi,
      tellimuse_kuupaev: order.tellimuse_kuupaev,
      summa: order.Arves?.[0]?.summa || 0
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении всех заказов', error: err.message });
  }
};

// получение заказа по tellimus_id

// для менеджеров и продавцов — отображаются все детали заказа

// для клиента — только его собственный заказ, с проверкой


exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Tellimus.findByPk(id, {
      include: [
        { model: Klient, attributes: ['nimi', 'email'] },
        { model: Tootaja, attributes: ['nimi', 'email'] },
        { model: TellimuseStaatused },
        {
          model: Arve,
          attributes: ['arve_id', 'makse_kuupaev', 'summa']
        },
        {
          model: ToodeteList,
          include: [{ 
            model: Toode, 
            as: 'toode',
            attributes: ['nimetus', 'tuup'],
            include: [{
              model: ToodeHinnad,
              attributes: ['hind', 'kuupaev'],
              limit: 1,
              order: [['kuupaev', 'DESC']],
              as: 'hinnad'
            }]
          }]
        },
        {
          model: TeenusedList,
          include: [{ model: Teenused, attributes: ['nimetus', 'hind'] }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    //  Проверка прав
    if (req.user.userType === 'klient' && order.klient_id !== req.user.id) {
      return res.status(403).json({ message: 'Нет доступа к этому заказу' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении заказа', error: err.message });
  }
};


// Менеджер назначает исполнителя на заказ
exports.assignWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { tootaja_id } = req.body;

    const tellimus = await Tellimus.findByPk(id);
    if (!tellimus) {
      return res.status(404).json({ message: 'Order not found' });
    }

    tellimus.tootaja_id = tootaja_id;
    await tellimus.save();

    res.json({ message: 'Worker assigned to order', tellimus });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign worker', error: err.message });
  }
};






// Универсальный способ добавить товар или услуги к заказу
exports.addItemsToOrder = async (req, res) => {
  const { id } = req.params;
  const { tooted = [], teenused = [] } = req.body;

  try {
    if (!['Manager', 'SalesManager'].includes(req.user.roll)) {
      return res.status(403).json({ message: 'Only managers can update orders' });
    }

    const order = await Tellimus.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let addedSum = 0;

    // --- Товары
    if (Array.isArray(tooted) && tooted.length > 0) {
      for (const item of tooted) {
        const price = await ToodeHinnad.findOne({
          where: { toode_id: item.toode_id },
          order: [['kuupaev', 'DESC']]
        });

        if (!price) {
          return res.status(400).json({ message: `Цена не найдена для товара ID ${item.toode_id}` });
        }

        await ToodeteList.create({
          tellimus_id: order.tellimus_id,
          toode_id: item.toode_id,
          arv: item.arv
        });

        addedSum += parseFloat(price.hind) * item.arv;
      }
    }

    // --- Услуги
    if (Array.isArray(teenused) && teenused.length > 0) {
      for (const item of teenused) {
        const service = await Teenused.findByPk(item.teenused_id);
        if (!service) {
          return res.status(400).json({ message: `Услуга с ID ${item.teenused_id} не найдена` });
        }

        await TeenusedList.create({
          tellimus_id: order.tellimus_id,
          teenused_id: item.teenused_id,
          arv: item.arv
        });

        addedSum += parseFloat(service.hind) * item.arv;
      }
    }

    // Обновление счета
    const invoice = await Arve.findOne({ where: { tellimus_id: order.tellimus_id } });
    if (invoice) {
      invoice.summa = parseFloat(invoice.summa) + addedSum;
      await invoice.save();
    }

    res.status(200).json({
      message: 'Позиции успешно добавлены в заказ',
      addedSum: addedSum.toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при добавлении товаров/услуг', error: err.message });
  }
};


// Удаление товара из заказа или услуги manager


exports.removeItemFromOrder = async (req, res) => {
  const { tellimus_id } = req.params;
  const { type, id } = req.body;

  if (!['toode', 'teenus'].includes(type)) {
    return res.status(400).json({ message: 'Недопустимый тип: должен быть toode или teenus' });
  }

  try {
    let item, price, sumDelta = 0;

    if (type === 'toode') {
      item = await ToodeteList.findByPk(id);
      if (!item || item.tellimus_id != tellimus_id) {
        return res.status(404).json({ message: 'Товар не найден в заказе' });
      }

      price = await ToodeHinnad.findOne({
        where: { toode_id: item.toode_id },
        order: [['kuupaev', 'DESC']]
      });

      sumDelta = price ? parseFloat(price.hind) * item.arv : 0;

      await item.destroy();
    }

    if (type === 'teenus') {
      item = await TeenusedList.findByPk(id);
      if (!item || item.tellimus_id != tellimus_id) {
        return res.status(404).json({ message: 'Услуга не найдена в заказе' });
      }

      const teenus = await Teenused.findByPk(item.teenused_id);
      sumDelta = teenus ? parseFloat(teenus.hind) * item.arv : 0;

      await item.destroy();
    }

    const invoice = await Arve.findOne({ where: { tellimus_id } });
    if (invoice && sumDelta > 0) {
      invoice.summa = parseFloat(invoice.summa) - sumDelta;
      await invoice.save();
    }

    res.json({
      message: `Позиция (${type}) удалена из заказа`,
      removedSum: sumDelta.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении позиции из заказа', error: err.message });
  }
};

// Получить подробные данные по заказу (order + products + services)
exports.getOrderFullDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем заказ
    const order = await Tellimus.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Заказ не найден' });

    // Получаем товары с alias 'toode'
    const products = await ToodeteList.findAll({
      where: { tellimus_id: id },
      include: [{
        model: Toode,
        as: 'toode',
        include: [{
          model: ToodeHinnad,
          as: 'hinnad',
          attributes: ['hind', 'kuupaev'],
          limit: 1,
          order: [['kuupaev', 'DESC']]
        }]
      }]
    });

    // Получаем услуги (без alias, т.к. в ассоциации его нет)
    const services = await TeenusedList.findAll({
      where: { tellimus_id: id },
      include: [{ model: Teenused }]
    });

    res.json({
      order,
      products,
      services
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении деталей заказа', error: err.message });
  }
};