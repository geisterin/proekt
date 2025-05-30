const express = require('express');
const router = express.Router();
const controller = require('../controllers/teenused_list.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Получить услуги для конкретного заказа
router.get('/:tellimusId', verifyToken, controller.getByOrder);

// Добавить услугу в заказ (только менеджеры)
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), controller.addToOrder);

module.exports = router;
