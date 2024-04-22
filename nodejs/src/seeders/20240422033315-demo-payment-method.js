'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Payment_methods', [{
      payment_method_name:"Tiền mặt",
    },{
      payment_method_name:"Chuyển khoản",
    },{
      payment_method_name:"Công nợ",
    }], {});
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
