const express = require('express');
const router = express.Router();

const { verifyToken, authorizeRoll } = require('../middleware/authJwt');
const tootajaController = require('../controllers/tootaja.controller');

// Доступ только для аутентифицированных сотрудников
router.get('/me', verifyToken, authorizeRoll(['Manager', 'SalesManager', 'Installer', 'Measurer', 'Owner']), tootajaController.getMyProfile);

router.put('/me', verifyToken, authorizeRoll(['Manager', 'SalesManager', 'Installer', 'Measurer', 'Owner']), tootajaController.updateMyProfile);


// Менеджеры могут видеть всё
router.get('/all', verifyToken, authorizeRoll(['Manager', 'SalesManager']), tootajaController.getAllTootajad);

module.exports = router;
