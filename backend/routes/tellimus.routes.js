const express = require('express');
const router = express.Router();
const tellimusController = require('../controllers/tellimus.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Только клиент может создавать и просматривать свои заказы
router.post('/', verifyToken, authorizeRoll('Client'), tellimusController.createOrder);
router.get('/my', verifyToken, tellimusController.getMyOrders);

// Менеджеры могут видеть всё
router.get('/all', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tellimusController.getAllOrders);


// Получение одного заказа по ID — только менеджер или продавец
router.get('/:id', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tellimusController.getOrderById);

// Менеджер назначает работника на заказ
router.put('/:id/assign-worker', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tellimusController.assignWorker);


// универсальное добавление товаров или услуг к заказы менеждером 
router.put('/:id/items', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tellimusController.addItemsToOrder);



// удалить Товары или услуги  из заказа
router.delete('/:tellimus_id/item', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tellimusController.removeItemFromOrder);

// Получение подробной информации о заказе (детали)
router.get('/:id/details', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tellimusController.getOrderFullDetails);

module.exports = router;
