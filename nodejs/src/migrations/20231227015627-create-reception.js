'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Receptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reception_account: {
        type: Sequelize.STRING(50)
      },
      reception_password: {
        type: Sequelize.TEXT
      },
      reception_name: {
        type: Sequelize.STRING(50)
      },
      reception_email: {
        type: Sequelize.STRING
      },
      reception_phone: {
        type: Sequelize.STRING(12)
      },
      reception_status: {
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
    await queryInterface.dropTable('Receptions');
  }
};