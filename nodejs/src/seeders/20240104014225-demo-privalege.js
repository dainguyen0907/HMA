'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Privileges', [{
        privilege_name:'Truy cập sơ đồ phòng',
      },{
        privilege_name:'Thiết lập nhà nghỉ',
      },{
        privilege_name:'Thiết lập loại giường và chỉnh sửa đơn giá',
      },{
        privilege_name:'Thiết lập dịch vụ',
      },{
        privilege_name:'Thiết lập khách hàng',
      },{
        privilege_name:'Cấu hình chương trình',
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
