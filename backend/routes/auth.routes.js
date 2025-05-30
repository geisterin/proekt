const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { verifyToken, authorizeRoll } = require('../middleware/authJwt'); // 💥 Вот этого не хватало

// ✅ Регистрация клиента (открыта)
router.post('/register-klient', authController.registerKlient);

// ВРЕМЕННО открыть регистрацию сотрудника
// ⚠️ ВРЕМЕННЫЙ ЭНДПОИНТ ДЛЯ РЕГИСТРАЦИИ МЕНЕДЖЕРА БЕЗ ТОКЕНА
router.post('/dev-register-manager', authController.devRegisterManager);



// ✅ Логин (общий)
router.post('/login', authController.login);

module.exports = router;
