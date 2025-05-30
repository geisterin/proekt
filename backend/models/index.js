const sequelize = require('../config/database');

const Roll = require('./roll');

const Klient = require('./klient');
const Tootaja = require('./tootaja');
const Tellimus = require('./tellimus');
const TellimuseStaatused = require('./tellimuse_staatused');
const Brand = require('./brand');
const Toode = require('./toode');
const ToodeHinnad = require('./toode_hinnad');
const ToodeteList = require('./toodete_list');
const Teenused = require('./teenused');
const TeenusedList = require('./teenused_list');
const TeenusedTeostajad = require('./teenused_teostajad');
const Sms = require('./sms');
const Arve = require('./arve');
const ViewTellimused = require('./viewTellimused');
const VArvedInfo = require('./v_arved_info');



// Связи
// Роли с клиентами и сотрудниками
Roll.hasMany(Klient, { foreignKey: 'roll_id' });
Klient.belongsTo(Roll, { foreignKey: 'roll_id' });

Roll.hasMany(Tootaja, { foreignKey: 'roll_id' });
Tootaja.belongsTo(Roll, { foreignKey: 'roll_id' });

// Клиент и Заказ
Klient.hasMany(Tellimus, { foreignKey: 'klient_id' });
Tellimus.belongsTo(Klient, { foreignKey: 'klient_id' });

// Сотрудник и Заказ
Tootaja.hasMany(Tellimus, { foreignKey: 'tootaja_id' });
Tellimus.belongsTo(Tootaja, { foreignKey: 'tootaja_id' });

// Заказ и Статусы
Tellimus.hasMany(TellimuseStaatused, { foreignKey: 'tellimus_id', as: 'staatused' });
TellimuseStaatused.belongsTo(Tellimus, { foreignKey: 'tellimus_id' });

// Товары и Бренды
Brand.hasMany(Toode, { foreignKey: 'brand_id' });
Toode.belongsTo(Brand, { foreignKey: 'brand_id' });

// Товары и Бренды
Brand.hasMany(Toode, { foreignKey: 'brand_id' });
Toode.belongsTo(Brand, { foreignKey: 'brand_id' });

// История цен
Toode.hasMany(ToodeHinnad, { foreignKey: 'toode_id', as: 'hinnad' });
ToodeHinnad.belongsTo(Toode, { foreignKey: 'toode_id' });

// Список товаров заказа
Toode.hasMany(ToodeteList, { foreignKey: 'toode_id' });
ToodeteList.belongsTo(Toode, { foreignKey: 'toode_id', as: 'toode' });

Tellimus.hasMany(ToodeteList, { foreignKey: 'tellimus_id' });
ToodeteList.belongsTo(Tellimus, { foreignKey: 'tellimus_id' });


// Список услуг заказа
Teenused.hasMany(TeenusedList, { foreignKey: 'teenused_id' });
TeenusedList.belongsTo(Teenused, { foreignKey: 'teenused_id' });

Tellimus.hasMany(TeenusedList, { foreignKey: 'tellimus_id' });
TeenusedList.belongsTo(Tellimus, { foreignKey: 'tellimus_id' });

// Исполнители услуг
TeenusedList.hasMany(TeenusedTeostajad, { foreignKey: 'teenused_list_id' });
TeenusedTeostajad.belongsTo(TeenusedList, { foreignKey: 'teenused_list_id' });

Tootaja.hasMany(TeenusedTeostajad, { foreignKey: 'tootaja_id' });
TeenusedTeostajad.belongsTo(Tootaja, { foreignKey: 'tootaja_id' });

// Сообщения (SMS)
Klient.hasMany(Sms, { foreignKey: 'klient_id' });
Sms.belongsTo(Klient, { foreignKey: 'klient_id' });

Tootaja.hasMany(Sms, { foreignKey: 'tootaja_id' });
Sms.belongsTo(Tootaja, { foreignKey: 'tootaja_id' });

// Заказ и Счёт
Tellimus.hasMany(Arve, { foreignKey: 'tellimus_id' });
Arve.belongsTo(Tellimus, { foreignKey: 'tellimus_id', as: 'Tellimus' });


const db = {
  sequelize,
  Roll,
  Klient,
  Tootaja,
  Tellimus,
  TellimuseStaatused,
  Brand,
  Toode,
  ToodeHinnad,
  ToodeteList,
  Teenused,
  TeenusedList,
  TeenusedTeostajad,
  Sms,
  Arve,
  VArvedInfo,
  ViewTellimused,
};

module.exports = db;
