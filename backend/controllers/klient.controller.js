const { Klient, Roll } = require('../models');
const bcrypt = require('bcrypt');


// 1. Получить текущий профиль клиента
exports.getMyProfile = async (req, res) => {
  try {
    const klientId = req.user.id;
    const userType = req.user.userType;

    if (userType !== 'klient') {
      return res.status(403).json({ message: 'Only clients can access this endpoint' });
    }

    const klient = await Klient.findByPk(klientId, {
      attributes: { exclude: ['parool'] },
      include: { model: Roll, foreignKey: 'roll_id' }
    });

    if (!klient) return res.status(404).json({ message: 'Client not found' });

    res.json(klient);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// 2. Обновить данные клиента
exports.updateMyProfile = async (req, res) => {
  try {
    const klientId = req.user.id;
    const userType = req.user.userType;

    if (userType !== 'klient') {
      return res.status(403).json({ message: 'Only clients can update their profile' });
    }

    const { nimi, perekonnanimi, telefon, aadress } = req.body;

    const klient = await Klient.findByPk(klientId);
    if (!klient) return res.status(404).json({ message: 'Client not found' });

    klient.nimi = nimi || klient.nimi;
    klient.perekonnanimi = perekonnanimi || klient.perekonnanimi;
    klient.telefon = telefon || klient.telefon;
    klient.aadress = aadress || klient.aadress;

    await klient.save();

    res.json({ message: 'Profile updated', klient });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const kliendid = await Klient.findAll({
      attributes: { exclude: ['parool'] },
    });
    res.json(kliendid);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении клиентов', error: err.message });
  }
};

// создать клиента менеждеру 

exports.addClient = async (req, res) => {
  try {
    const { nimi, perekonnanimi, email, telefon, aadress, parool } = req.body;

    const existing = await Klient.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(parool, 10);

    const klient = await Klient.create({
      nimi,
      perekonnanimi,
      email,
      telefon,
      aadress,
      parool: hashedPassword,
      roll_id: 5 // по умолчанию: клиент
    });

    res.status(201).json({ message: 'Client added', klient_id: klient.klient_id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add client', error: err.message });
  }
};


// Обновление клиента по ID (только для менеджера)

exports.updateClientById = async (req, res) => {
  try {
    const { klientId } = req.params;
    const { nimi, perekonnanimi, email, telefon, aadress } = req.body;

    const klient = await Klient.findByPk(klientId);
    if (!klient) return res.status(404).json({ message: 'Client not found' });

    klient.nimi = nimi || klient.nimi;
    klient.perekonnanimi = perekonnanimi || klient.perekonnanimi;
    klient.email = email || klient.email;
    klient.telefon = telefon || klient.telefon;
    klient.aadress = aadress || klient.aadress;

    await klient.save();

    res.json({ message: 'Client updated', klient });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
};

