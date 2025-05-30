🪟 Window Sale App — Backend Setup Guide

    Node.js + Express + PostgreSQL
    Клиент и менеджер могут входить, создавать и просматривать заказы.
    Таблицы и данные уже есть в базе. Нужно только подключиться.

## 📁 Структура проекта

```
window-sale-app/
│
├── models/              # Sequelize модели (Klient, Tootaja, Roll и т.д.)
├── controllers/         # Контроллеры для маршрутов
├── routes/              # Express-маршруты
├── seeders/             # Сидеры для начальных данных (роли)
├── config/              # Настройки базы данных
├── middleware/          # Авторизация (JWT)
├── .env                 # Переменные окружения (НЕ публиковать)
├── server.js            # Точка входа
├── package.json         # Зависимости
└── README.md            # Этот файл
```
📦 Что нужно установить

❗Перед началом убедись, что у тебя установлен:
Инструмент	Команда проверки	Сайт установки
Node.js	node -v	https://nodejs.org
npm	npm -v	(входит в Node.js)
Git	git --version	https://git-scm.com
Postman (по желанию)	—	https://www.postman.com
---

## 🚀 Как запустить проект локально

1: Клонируй проект

git clone https://github.com/zhakki/window-sale-backend.git
cd window-sale-backend


2. Установи зависимости:

npm install


3: Создай .env файл

В корне проекта создай файл .env на основе .env.example:


PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=windows_sale
DB_USER=your_user_name
DB_PASSWORD=yourpassword
JWT_SECRET=secretkey

⚠️ Используй данные, которые тебе дал backend-разработчик (логин/пароль от PostgreSQL).

4: База данных уже готова

✅ База windows_sale уже создана, таблицы и данные есть.
Подключение только на чтение/запись — ничего создавать не надо.

5: Запусти проект

## 🛠️ Команды

bash
# Запуск сервера
npm run dev


# Применить сидеры (добавить роли)
npx sequelize-cli db:seed:all --env development


Пример клиента для захода

{"email": "kaja.vaz@example.com", "password": "yourpassword", "userType": "klient"}

# Синхронизация БД
node server.js


если все работает, то ты увидешь :)
✅ DB synced
🚀 Server running at http://localhost:3000



## ✅ Готовые пользователи

| Роль     | Email              | Пароль     |
|----------|--------------------|------------|
| Клиент   | ilona@example.com  | salasana123 |
| Менеджер | admin@manager.com  | admin123    |

---

## 📬 Контакты

Автор проекта: [@zhakki](https://github.com/zhakki)  
Если хочешь продолжать разработку — welcome!
