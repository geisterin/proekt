const { TellimuseStaatused, Tellimus, Klient } = require('../models');

//  Список допустимых статусов
const allowedStatuses = [
  'esitatud',
  'kinnitatud',
  'moodetud',
  'valmistamisel',
  'paigaldatud',
  'taidetud',
  'lopetatud',
  'tuhistatud'
];


// Добавить статус
exports.addStatus = async (req, res) => {
  try {
    const { tellimus_id, staatus } = req.body;

    if (!allowedStatuses.includes(staatus)) {
      return res.status(400).json({ message: 'Недопустимый статус' });
    }

    const newStatus = await TellimuseStaatused.create({
      tellimus_id,
      staatus,
      kuupaev: new Date()
    });

    res.status(201).json({
      message: 'Статус добавлен',
      status: newStatus
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении статуса', error: err.message });
  }
};



// История всех статусов заказа
exports.getHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await TellimuseStaatused.findAll({
      where: { tellimus_id: id },
      order: [['kuupaev', 'DESC']]
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении истории', error: err.message });
  }
};


// Получить последний (текущий) статус
exports.getCurrentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const lastStatus = await TellimuseStaatused.findOne({
      where: { tellimus_id: id },
      order: [['kuupaev', 'DESC']],
      include: {
        model: Tellimus,
        include: { model: Klient, attributes: ['nimi', 'email'] }
      }
    });

    if (!lastStatus) {
      return res.status(404).json({ message: 'Статус не найден' });
    }

    res.json(lastStatus);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении статуса', error: err.message });
  }
};
