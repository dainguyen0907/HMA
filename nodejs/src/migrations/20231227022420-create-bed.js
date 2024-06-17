'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Beds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_room: {
        type: Sequelize.INTEGER
      },
      id_customer:{
        type: Sequelize.INTEGER
      },
      id_bed_type: {
        type: Sequelize.INTEGER
      },
      id_invoice: {
        type: Sequelize.INTEGER
      },
      id_price: {
        type: Sequelize.INTEGER
      },
      bed_checkin: {
        type: Sequelize.DATE
      },
      bed_checkout: {
        type: Sequelize.DATE
      },
      bed_status: {
        type: Sequelize.BOOLEAN
      },
      bed_deposit: {
        type: Sequelize.BIGINT
      },
      bed_lunch_break:{
        type:Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Beds');
  }
};