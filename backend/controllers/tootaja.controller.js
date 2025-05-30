const { Tootaja, Roll } = require('../models');

// 1. Получить профиль сотрудника
exports.getMyProfile = async (req, res) => {
  try {
    const { id, userType } = req.user;

    if (userType !== 'tootaja') {
      return res.status(403).json({ message: 'Only workers can access this endpoint' });
    }

    const tootaja = await Tootaja.findByPk(id, {
      attributes: { exclude: ['parool'] },
      include: { model: Roll, foreignKey: 'roll_id' }
    });

    if (!tootaja) return res.status(404).json({ message: 'Worker not found' });

    res.json(tootaja);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch worker profile', error: err.message });
  }
};

// 2. Обновить профиль сотрудника
exports.updateMyProfile = async (req, res) => {
  try {
    const { id, userType } = req.user;

    if (userType !== 'tootaja') {
      return res.status(403).json({ message: 'Only workers can update their profile' });
    }

    const { nimi, perekonnanimi, telefon } = req.body;

    const tootaja = await Tootaja.findByPk(id);
    if (!tootaja) return res.status(404).json({ message: 'Worker not found' });

    tootaja.nimi = nimi || tootaja.nimi;
    tootaja.perekonnanimi = perekonnanimi || tootaja.perekonnanimi;
    tootaja.telefon = telefon || tootaja.telefon;

    await tootaja.save();

    res.json({ message: 'Worker profile updated', tootaja });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update worker profile', error: err.message });
  }
};




exports.getAllTootajad = async (req, res) => {
  try {
    const users = await Tootaja.findAll({
      attributes: { exclude: ['parool'] },
      include: { model: Roll, foreignKey: 'roll_id' }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении сотрудников', error: err.message });
  }
};
