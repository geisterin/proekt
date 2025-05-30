const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Klient = sequelize.define('Klient', {
  klient_id: {
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
  aadress: {
    type: DataTypes.STRING,
  },
  reg_kuupaev: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  roll_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  parool: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'klient',
  schema: 'windows_sale',
  timestamps: false,
});

module.exports = Klient;
