const express = require('express');
const router = express.Router();
const staatusController = require('../controllers/tellimuse_staatused.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Добавить статус (только сотрудник)
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), staatusController.addStatus);


// Получить всю историю статусов заказа
router.get('/:id/history', verifyToken, staatusController.getHistory);

// Получить текущий (последний) статус заказа
router.get('/:id/current', verifyToken, staatusController.getCurrentStatus);

module.exports = router;
