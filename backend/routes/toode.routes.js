const express = require('express');
const router = express.Router();
const toodeController = require('../controllers/toode.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');


// Добавить товар (только SalesManager или Manager)
router.post('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), toodeController.create);

// Получить все товары (и клиент и работник)
router.get('/', verifyToken, authorizeRoll(['Client','Manager', 'SalesManager']), toodeController.getAllTooted);


// Получить конкретный товар
router.get('/:id', verifyToken, authorizeRoll(['Client','Manager', 'SalesManager']), toodeController.getOne);


// Обновить товар
router.put('/:id', verifyToken, authorizeRoll(['Manager', 'SalesManager']), toodeController.update);

// удалить товар
router.delete('/:id', verifyToken, authorizeRoll(['Manager', 'SalesManager']), toodeController.delete);


module.exports = router;
