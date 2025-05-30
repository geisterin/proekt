const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ToodeteList = sequelize.define('ToodeteList', {
  toode_list_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tellimus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  toode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  arv: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'toodete_list',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = ToodeteList;
