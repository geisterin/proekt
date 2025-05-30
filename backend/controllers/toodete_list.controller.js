const { ToodeteList, Toode } = require('../models');

exports.getByOrder = async (req, res) => {
  try {
    const { tellimusId } = req.params;

    const items = await ToodeteList.findAll({
      where: { tellimus_id: tellimusId },
      include: { model: Toode, foreignKey: 'toode_id', as: 'toode' }
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products for order', error: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { tellimus_id, toode_id, arv } = req.body;

    const item = await ToodeteList.create({
      tellimus_id,
      toode_id,
      arv
    });

    res.status(201).json({ message: 'Product added to order', item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product to order', error: err.message });
  }
};
