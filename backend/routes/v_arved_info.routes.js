const express = require('express');
const router = express.Router();
const controller = require('../controllers/v_arved_info.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

console.log('✅ v_arved_info.routes.js загружен'); // для отладки

router.get('/', verifyToken, authorizeRoll(['Manager', 'SalesManager']), controller.getAllInvoicesView);

module.exports = router;
