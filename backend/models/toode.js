const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Toode = sequelize.define('Toode', {
  toode_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nimetus: DataTypes.STRING,
  kirjeldus: DataTypes.TEXT,
  standart_suurus: DataTypes.STRING,
  toode_pilt: DataTypes.TEXT,
  tuup: DataTypes.STRING,
  brand_id: {
    type: DataTypes.INTEGER,

  }
}, {
  tableName: 'toode',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = Toode;
