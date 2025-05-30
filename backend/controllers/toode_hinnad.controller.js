const { ToodeHinnad } = require('../models');

exports.getPricesByProduct = async (req, res) => {
  try {
    const prices = await ToodeHinnad.findAll({
      where: { toode_id: req.params.toodeId },
      order: [['kuupaev', 'DESC']]
    });

    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get prices', error: err.message });
  }
};

exports.addPrice = async (req, res) => {
  try {
    const { toode_id, kuupaev, hind } = req.body;

    const newPrice = await ToodeHinnad.create({ toode_id, kuupaev, hind });

    res.status(201).json({ message: 'Price added', price: newPrice });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add price', error: err.message });
  }
};
