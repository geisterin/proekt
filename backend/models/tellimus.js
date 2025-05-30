const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tellimus = sequelize.define('Tellimus', {
  tellimus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tellimuse_kuupaev: DataTypes.DATE,
  klient_id: {
    type: DataTypes.INTEGER,
    allowNull: false

  },
  tootaja_id: {
    type: DataTypes.INTEGER,
  },
  kuu_arv: DataTypes.INTEGER
}, {
  tableName: 'tellimus',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = Tellimus;
