'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Payment_methods', [{
      id:1,
      payment_method_name:"Tiền mặt",
    },{
      id:2,
      payment_method_name:"Chuyển khoản",
    },{
      id:3,
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
