// Импорт необходимых модулей
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Подгрузка переменных окружения из .env

const app = express();

// Настройка CORS для фронтенда (на 3005 порту)
app.use(cors({
  origin: 'http://localhost:3005',
  credentials: true, // Разрешение на передачу куки и авторизационных заголовков
}));

// Встроенный парсер JSON-запросов
app.use(express.json());

// Подключение моделей и связей с базой данных
const db = require('./models');

// Импорт всех маршрутов API
const authRoutes = require('./routes/auth.routes');
const klientRoutes = require('./routes/klient.routes');
const tootajaRoutes = require('./routes/tootaja.routes');
const tellimusRoutes = require('./routes/tellimus.routes');
const staatusRoutes = require('./routes/tellimuse_staatused.routes');
const arveRoutes = require('./routes/arve.routes');
const toodeRoutes = require('./routes/toode.routes');
const hinnadRoutes = require('./routes/toode_hinnad.routes');
const toodeteListRoutes = require('./routes/toodete_list.routes');
const brandRoutes = require('./routes/brand.routes');
const teenusedRoutes = require('./routes/teenused.routes');
const teenusedListRoutes = require('./routes/teenused_list.routes');
const teostajadRoutes = require('./routes/teenused_teostajad.routes');
const smsRoutes = require('./routes/sms.routes');
const uploadRoutes = require('./routes/upload.routes');

// Привязка маршрутов к путям API
app.use('/api/auth', authRoutes);
app.use('/api/klient', klientRoutes);
app.use('/api/tootaja', tootajaRoutes);
app.use('/api/tellimus', tellimusRoutes);
app.use('/api/staatused', staatusRoutes);
app.use('/api/invoices', arveRoutes);
app.use('/api/tooted', toodeRoutes);
app.use('/api/hinnad', hinnadRoutes);
app.use('/api/toode-list', toodeteListRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/teenused', teenusedRoutes);
app.use('/api/teenused-list', teenusedListRoutes);
app.use('/api/teenused-teostajad', teostajadRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/upload', uploadRoutes);

// Раздача статики для public/uploads
app.use('/uploads', express.static('public/uploads'));

// Установка порта
const PORT = process.env.PORT || 3000;

// Синхронизация базы данных и запуск сервера
db.sequelize.sync()
  .then(() => {
    console.log('✅ Синхронизация БД завершена');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Ошибка при синхронизации БД:', err.message);
  });
