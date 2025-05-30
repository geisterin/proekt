const express = require('express');
const router = express.Router();
const arveController = require('../controllers/arve.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Клиент получает свой счёт по ID заказа
router.get('/:tellimusId', verifyToken, authorizeRoll(['Client','Manager', 'SalesManager']), arveController.getInvoiceByOrder);

// Клиент оплачивает счёт
router.post('/pay/:invoiceId', verifyToken, authorizeRoll(['Client', 'Manager']), arveController.payInvoice);

// Менеджеры видят все счета
router.get('/all', verifyToken, authorizeRoll(['Manager', 'SalesManager']), arveController.getAllInvoices);

// Счета по заказу для менеджеров
router.get('/by-order/:tellimusId', verifyToken, authorizeRoll(['Manager', 'SalesManager']), arveController.getInvoicesByOrderForManager);

module.exports = router;
