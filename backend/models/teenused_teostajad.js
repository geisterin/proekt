const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeenusedTeostajad = sequelize.define('TeenusedTeostajad', {
  teostaja_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teenused_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  tootaja_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teostamise_kuupaev: {
    type: DataTypes.DATE,
    allowNull: true
  },
  kommentaar: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'teenused_teostajad',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = TeenusedTeostajad;
