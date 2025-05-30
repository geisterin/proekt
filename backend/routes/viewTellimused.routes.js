const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewTellimused.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Клиент видит только свои
router.get('/my', verifyToken, viewController.getMyOrdersWithPayments);

// Менеджеры видят всё
router.get('/all', verifyToken, authorizeRoll(['Manager', 'SalesManager']), viewController.getAllOrdersForManagers);

module.exports = router;
