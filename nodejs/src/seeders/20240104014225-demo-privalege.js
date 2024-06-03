'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Privileges', [{
        id:1,
        privilege_name:'Truy cập sơ đồ phòng',
      },{
        id:2,
        privilege_name:'Thiết lập nhà nghỉ',
      },{
        id:3,
        privilege_name:'Thiết lập loại giường và chỉnh sửa đơn giá',
      },{
        id:4,
        privilege_name:'Thiết lập dịch vụ',
      },{
        id:5,
        privilege_name:'Thiết lập khách hàng',
      },{
        id:6,
        privilege_name:'Cập nhật hoá đơn'
      },{
        id:7,
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
