const { Brand } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch brands', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nimi, kirjeldus, riik } = req.body;

    const newBrand = await Brand.create({ nimi, kirjeldus, riik });

    res.status(201).json({ message: 'Brand created', brand: newBrand });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create brand', error: err.message });
  }
};
