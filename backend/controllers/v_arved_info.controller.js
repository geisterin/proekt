const { VArvedInfo } = require('../models');

exports.getAllInvoicesView = async (req, res) => {
  try {
    const userRole = req.user?.roll;
    if (!['Manager', 'SalesManager'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await VArvedInfo.findAll();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении данных из представления', error: err.message });
  }
};
