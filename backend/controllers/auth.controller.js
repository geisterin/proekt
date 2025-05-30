const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Импорт моделей
const { Klient, Tootaja, Roll } = require('../models');


// ===============================================
// ✅ 1. Регистрация клиента
// ===============================================
exports.registerKlient = async (req, res) => {
  try {
    console.log("Данные из формы регистрации:", req.body);

    const { nimi, perekonnanimi, email, telefon, aadress, parool } = req.body;

    // Проверка обязательных полей
    if (!nimi || !email || !parool) {
      return res.status(400).json({ message: "Имя, email и пароль обязательны" });
    }

    // Проверка: есть ли уже пользователь с таким email
    const existing = await Klient.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email уже зарегистрирован' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(parool, 10);

    // Создаём нового клиента
    const klient = await Klient.create({
      nimi,
      perekonnanimi,
      email,
      telefon,
      aadress,
      parool: hashedPassword,
      reg_kuupaev: new Date(),
      roll_id: 5 // ID роли "Клиент"
    });

    res.status(201).json({
      message: 'Клиент успешно зарегистрирован',
      klient_id: klient.klient_id
    });
  } catch (err) {
    console.error("❌ Ошибка при регистрации клиента:", err);
    res.status(500).json({
      message: 'Ошибка при регистрации клиента',
      error: err.message
    });
  }
};


// ===============================================
// ✅ 2. Регистрация сотрудника (доступно только Manager)
// ===============================================
exports.registerTootaja = async (req, res) => {
  try {
    const requestingUser = req.user; // пришёл из verifyToken middleware

    // Только менеджер может регистрировать других сотрудников
    if (!requestingUser || requestingUser.roll !== 'Manager') {
      return res.status(403).json({
        message: 'Только менеджер может регистрировать сотрудников'
      });
    }

    const { nimi, perekonnanimi, email, telefon, parool, roll_id } = req.body;

    const existing = await Tootaja.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email уже используется' });
    }

    const hashedPassword = await bcrypt.hash(parool, 10);

    const tootaja = await Tootaja.create({
      nimi,
      perekonnanimi,
      email,
      telefon,
      parool: hashedPassword,
      roll_id
    });

    res.status(201).json({
      message: 'Сотрудник успешно зарегистрирован',
      tootaja_id: tootaja.tootaja_id
    });
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка при регистрации сотрудника',
      error: err.message
    });
  }
};


// ===============================================
// ✅ 3. Универсальный логин (без выбора userType на фронте)
// ===============================================
exports.login = async (req, res) => {
  console.log('Запрос на логин:', req.body);
  const { email, password } = req.body;

  try {
    // Сначала ищем среди сотрудников
    let user = await Tootaja.findOne({
      where: { email },
      include: { model: Roll, foreignKey: 'roll_id' }
    });

    let idField = 'tootaja_id';
    let userType = 'tootaja';

    // Если не нашли сотрудника — пробуем найти клиента
    if (!user) {
      user = await Klient.findOne({
        where: { email },
        include: { model: Roll, foreignKey: 'roll_id' }
      });

      idField = 'klient_id';
      userType = 'klient';
    }

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка пароля
    const valid = await bcrypt.compare(password, user.parool);
    if (!valid) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      {
        id: user[idField],
        userType,
        roll: user.Roll.roll_nimi
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Отправляем токен и информацию о пользователе
    res.json({
      token,
      user: {
        id: user[idField],
        email: user.email,
        roll: user.Roll.roll_nimi,
        userType
      }
    });
  } catch (err) {
    console.log('Ошибка сервера при логине:', err);
    res.status(500).json({ message: 'Ошибка входа', error: err.message });
  }
};


// ===============================================
// ✅ 4. Быстрая регистрация менеджера (для DEV целей)
// ===============================================
exports.devRegisterManager = async (req, res) => {
  try {
    const { nimi, perekonnanimi, email, telefon, parool } = req.body;

    const existing = await Tootaja.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email уже используется' });
    }

    const hashedPassword = await bcrypt.hash(parool, 10);

    const manager = await Tootaja.create({
      nimi,
      perekonnanimi,
      email,
      telefon,
      parool: hashedPassword,
      roll_id: 1 // Роль "Менеджер"
    });

    res.status(201).json({
      message: 'Менеджер успешно зарегистрирован (DEV)',
      tootaja_id: manager.tootaja_id
    });
  } catch (err) {
    res.status(500).json({
      message: 'Ошибка при регистрации менеджера',
      error: err.message
    });
  }
};
