const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeenusedList = sequelize.define('TeenusedList', {
  teenused_list_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tellimus_id: {
    type: DataTypes.INTEGER,

  },
  teenused_id: {
    type: DataTypes.INTEGER,

  },
  arv: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'teenused_list',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = TeenusedList;
