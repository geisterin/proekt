const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tootaja = sequelize.define('Tootaja', {
  tootaja_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nimi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  perekonnanimi: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  telefon: {
    type: DataTypes.STRING,
  },
  roll_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parool: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'tootaja',
  schema: 'windows_sale',
  timestamps: false,
});

module.exports = Tootaja;

