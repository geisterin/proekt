const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');
const klientController = require('../controllers/klient.controller');

// Только клиент (роль = Client)
router.get('/me', verifyToken, authorizeRoll('Client'), klientController.getMyProfile);
router.put('/me', verifyToken, authorizeRoll('Client'), klientController.updateMyProfile);

// Смотреть всех клиентов админу 
router.get('/all', verifyToken, authorizeRoll('Manager'), klientController.getAllClients);


// Добавить нового клиента (только для менеджера)
router.post('/add', verifyToken, authorizeRoll('Manager'), klientController.addClient);

// Обновить данные клиента по ID (только для менеджера)
router.put('/:klientId', verifyToken, authorizeRoll('Manager'), klientController.updateClientById);


module.exports = router;
