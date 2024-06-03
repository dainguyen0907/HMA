'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Privilege_details', [
      {id_user:1, id_privilege:1},
      {id_user:1, id_privilege:2},
      {id_user:1, id_privilege:3},
      {id_user:1, id_privilege:4},
      {id_user:1, id_privilege:5},
      {id_user:1, id_privilege:6},
      {id_user:1, id_privilege:7}
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
