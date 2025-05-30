const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VArvedInfo = sequelize.define('VArvedInfo', {
  arve_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  tellimus_id: DataTypes.INTEGER,
  tellimuse_kuupaev: DataTypes.DATE,
  klient: DataTypes.STRING,
  makse_kuupaev: DataTypes.DATE,
  summa: DataTypes.DECIMAL,
  ettemaks: DataTypes.DECIMAL,
  jaak: DataTypes.DECIMAL
}, {
  tableName: 'v_arved_info',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = VArvedInfo;
