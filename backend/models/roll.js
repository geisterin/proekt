const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Roll = sequelize.define('Roll', {
  roll_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roll_nimi: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roll_description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'roll',
  schema: 'windows_sale',
  timestamps: false,
});

module.exports = Roll;
