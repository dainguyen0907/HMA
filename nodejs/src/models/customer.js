'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    customer_name: DataTypes.STRING,
    customer_gender: DataTypes.BOOLEAN,
    customer_email: DataTypes.STRING,
    customer: DataTypes.TEXT,
    customer_phone: DataTypes.STRING,
    customer_identification: DataTypes.STRING,
    customer_dob: DataTypes.DATE,
    customer_student_code: DataTypes.STRING,
    customer_class: DataTypes.STRING,
    customer_pob: DataTypes.STRING,
    customer_status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};