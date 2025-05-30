const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ToodeHinnad = sequelize.define('ToodeHinnad', {
  toode_hinnad_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  toode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kuupaev: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hind: {
    type: DataTypes.NUMERIC,
    allowNull: false
  }
}, {
  tableName: 'toode_hinnad',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = ToodeHinnad;
