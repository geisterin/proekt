const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');
const { verifyToken } = require('../middleware/authJwt');

// Отправить сообщение (клиент или сотрудник)
router.post('/', verifyToken, smsController.sendSms);

// Получить все SMS клиента
router.get('/klient/:klientId', verifyToken, smsController.getByKlient);

// Получить все SMS сотрудника
router.get('/tootaja/:tootajaId', verifyToken, smsController.getByTootaja);

module.exports = router;
