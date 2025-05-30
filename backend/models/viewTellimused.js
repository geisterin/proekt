const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ViewTellimused = sequelize.define('ViewTellimused', {
  tellimus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  klient_id: DataTypes.INTEGER,
  klient_nimi: DataTypes.STRING,
  tootaja_id: DataTypes.INTEGER,
  tootaja_nimi: DataTypes.STRING,
  tellimuse_kuupaev: DataTypes.DATE,
  aktiivne_staatus: DataTypes.STRING,
  staatus_kuupaev: DataTypes.DATE,
  summa_tooted: DataTypes.DECIMAL,
  summa_tood: DataTypes.DECIMAL,
  kokku: DataTypes.DECIMAL,
  makstud_summa: DataTypes.DECIMAL,
  viimane_makse_kuupaev: DataTypes.DATE,
  makse_staatus: DataTypes.STRING,
  tooted_json: DataTypes.JSON,
  tood_json: DataTypes.JSON,
}, {
  tableName: 'view_tellimused',
  schema: 'windows_sale',
  timestamps: false
});

module.exports = ViewTellimused;
