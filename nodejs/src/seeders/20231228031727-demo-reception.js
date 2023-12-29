'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Receptions', [{
      reception_account: 'Administrator',
      reception_password: '$2a$12$06ec.r1jAFagmSFzZlSU9.4YttSrBtmzjtiZk2F1KdxeObKuNIzw6',
      reception_name: 'Administrator',
      reception_email: '',
      reception_phone: '',
      reception_status: true
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
