const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  brand_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nimi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kirjeldus: {
    type: DataTypes.TEXT
  },
  riik: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'brand',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = Brand;
