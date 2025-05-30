const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teenused = sequelize.define('Teenused', {
  teenused_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nimetus: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hind: {
    type: DataTypes.NUMERIC,
    allowNull: false
  }
}, {
  tableName: 'teenused',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = Teenused;
