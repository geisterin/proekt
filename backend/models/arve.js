const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Arve = sequelize.define('Arve', {
  arve_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tellimus_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  makse_kuupaev: {
    type: DataTypes.DATE
  },
  summa: {
    type: DataTypes.NUMERIC
  },
  ettemaks: {
    type: DataTypes.NUMERIC,
  },
}, {
  tableName: 'arve',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = Arve;

