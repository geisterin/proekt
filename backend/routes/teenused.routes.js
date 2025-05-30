const express = require('express');
const router = express.Router();
const teenusedController = require('../controllers/teenused.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Получить список услуг
router.get('/', teenusedController.getAll);

// Добавить новую услугу (только менеджеры)
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), teenusedController.create);

// Удалить услугу (только менеджеры)
router.delete('/:id', verifyToken, authorizeRoll(['Manager', 'SalesManager']), teenusedController.delete);

// Обновить услугу (только менеджеры)
router.put('/:id', verifyToken, authorizeRoll(['Manager', 'SalesManager']), teenusedController.update);

module.exports = router;
