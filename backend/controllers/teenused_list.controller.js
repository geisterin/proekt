const { TeenusedList, Teenused } = require('../models');

exports.getByOrder = async (req, res) => {
  try {
    const { tellimusId } = req.params;

    const items = await TeenusedList.findAll({
      where: { tellimus_id: tellimusId },
      include: { model: Teenused, foreignKey: 'teenused_id' }
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get services for order', error: err.message });
  }
};

exports.addToOrder = async (req, res) => {
  try {
    const { tellimus_id, teenused_id, arv } = req.body;

    const newEntry = await TeenusedList.create({ tellimus_id, teenused_id, arv });

    res.status(201).json({ message: 'Service added to order', entry: newEntry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add service', error: err.message });
  }
};
