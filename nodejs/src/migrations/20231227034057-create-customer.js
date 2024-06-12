'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_course: {
        type: Sequelize.INTEGER
      },
      id_company: {
        type: Sequelize.INTEGER
      },
      customer_name: {
        type: Sequelize.STRING(50)
      },
      customer_gender: {
        type: Sequelize.BOOLEAN
      },
      customer_email: {
        type: Sequelize.STRING
      },
      customer_address: {
        type: Sequelize.TEXT
      },
      customer_phone: {
        type: Sequelize.STRING(15)
      },
      customer_identification: {
        type: Sequelize.STRING(15)
      },
      customer_status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Customers');
  }
};