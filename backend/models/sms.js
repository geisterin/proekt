const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sms = sequelize.define('Sms', {
  sms_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  klient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tootaja_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tekst: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  staatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'sent'
  }
}, {
  tableName: 'sms',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = Sms;
