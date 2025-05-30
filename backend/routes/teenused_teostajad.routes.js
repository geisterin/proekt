const express = require('express');
const router = express.Router();
const controller = require('../controllers/teenused_teostajad.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt');

// Получить исполнителей по teenused_list_id
router.get('/:teenused_list_id', verifyToken, controller.getByServiceList);

// Добавить исполнителя (доступно сотрудникам)
router.post('/', verifyToken, authorizeRoll(['Manager', 'Installer', 'Measurer']), controller.addExecutor);

module.exports = router;
