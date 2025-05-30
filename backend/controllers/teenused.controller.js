const { Teenused } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const teenused = await Teenused.findAll();
    res.json(teenused);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nimetus, hind } = req.body;

    const teenus = await Teenused.create({ nimetus, hind });

    res.status(201).json({ message: 'Service created', teenus });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await require('../models').Teenused.destroy({ where: { teenused_id: id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Услуга не найдена' });
    }
    res.json({ message: 'Услуга удалена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении услуги', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nimetus, hind } = req.body;
    const [updated] = await require('../models').Teenused.update(
      { nimetus, hind },
      { where: { teenused_id: id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Услуга не найдена' });
    }
    res.json({ message: 'Услуга обновлена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении услуги', error: err.message });
  }
};
