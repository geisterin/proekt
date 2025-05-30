const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Получить все бренды
router.get('/', brandController.getAll);

// Добавить новый бренд (только менеджеры)
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), brandController.create);

module.exports = router;
