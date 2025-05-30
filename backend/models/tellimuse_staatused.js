const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TellimuseStaatused = sequelize.define('TellimuseStaatused', {
  tellimuse_staatused_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tellimus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  staatus: {
    type: DataTypes.ENUM(
      'esitatud',
      'kinnitatud',
      'moodetud',
      'valmistamisel',
      'paigaldatud',
      'taidetud',
      'lopetatud',
      'tuhistatud'
    ),
    allowNull: false,
  },
  kuupaev: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tellimuse_staatused',
  schema: 'windows_sale',
  timestamps: false,
});

module.exports = TellimuseStaatused;

