'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('salasona123', 10);

    await queryInterface.bulkInsert(
      { tableName: 'tootaja', schema: 'windows_sale' },
      [
        {
          nimi: 'Mari',
          perekonnanimi: 'Manager',
          email: 'mari.manager@example.com',
          telefon: '5551111',
          roll_id: 1,
          parool: hashedPassword
        },
        {
          nimi: 'Karl',
          perekonnanimi: 'Sales',
          email: 'karl.sales@example.com',
          telefon: '5552222',
          roll_id: 2,
          parool: hashedPassword
        },
        {
          nimi: 'Anna',
          perekonnanimi: 'Installer',
          email: 'anna.installer@example.com',
          telefon: '5553333',
          roll_id: 3,
          parool: hashedPassword
        },
        {
          nimi: 'Jaan',
          perekonnanimi: 'Measurer',
          email: 'jaan.measurer@example.com',
          telefon: '5554444',
          roll_id: 4,
          parool: hashedPassword
        },
        {
          nimi: 'Liis',
          perekonnanimi: 'Owner',
          email: 'liis.owner@example.com',
          telefon: '5559999',
          roll_id: 6,
          parool: hashedPassword
        }
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: 'tootaja', schema: 'windows_sale' },
      null,
      {}
    );
  }
};
