const express = require('express');
const router = express.Router();
const priceController = require('../controllers/toode_hinnad.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Все могут просматривать историю цен
router.get('/:toodeId', priceController.getPricesByProduct);

// Добавить цену — только менеджеры
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), priceController.addPrice);

module.exports = router;
