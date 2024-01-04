'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_method extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment_method.init({
    payment_method_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment_method',
  });
  return Payment_method;
};