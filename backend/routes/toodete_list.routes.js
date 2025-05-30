const express = require('express');
const router = express.Router();
const listController = require('../controllers/toodete_list.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Получить все товары для конкретного заказа
router.get('/:tellimusId', verifyToken, listController.getByOrder);

// Добавить товар в заказ (менеджеры)
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), listController.addItem);

module.exports = router;
