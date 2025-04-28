'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Customize these:
    const email = 'admin@admin.com';
    const plainPassword = 'admin123';

    // hash the password synchronously
    const passwordHash = bcrypt.hashSync(plainPassword, 10);

    return queryInterface.bulkInsert('Users', [{
      role: 'admin',
      email,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // must match the same email you inserted
    return queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  }
};
