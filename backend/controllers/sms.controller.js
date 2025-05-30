const { Sms } = require('../models');

exports.sendSms = async (req, res) => {
  try {
    const { klient_id, tootaja_id, tekst } = req.body;

    const newSms = await Sms.create({
      klient_id,
      tootaja_id,
      tekst,
      staatus: 'sent'
    });

    res.status(201).json({ message: 'SMS sent', sms: newSms });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send SMS', error: err.message });
  }
};

exports.getByKlient = async (req, res) => {
  try {
    const smsList = await Sms.findAll({
      where: { klient_id: req.params.klientId },
      order: [['sms_id', 'DESC']]
    });

    res.json(smsList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages', error: err.message });
  }
};

exports.getByTootaja = async (req, res) => {
  try {
    const smsList = await Sms.findAll({
      where: { tootaja_id: req.params.tootajaId },
      order: [['sms_id', 'DESC']]
    });

    res.json(smsList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages', error: err.message });
  }
};
