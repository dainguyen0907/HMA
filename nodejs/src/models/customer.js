'use strict';
import {Model} from 'sequelize';
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
    id_course:DataTypes.INTEGER,
    id_company:DataTypes.INTEGER,
    customer_name: DataTypes.STRING,
    customer_gender: DataTypes.BOOLEAN,
    customer_email: DataTypes.STRING,
    customer_address: DataTypes.TEXT,
    customer_phone: DataTypes.STRING,
    customer_identification: DataTypes.STRING,
    customer_status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};