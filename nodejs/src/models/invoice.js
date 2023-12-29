'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invoice.init({
    id_payment_method: DataTypes.INTEGER,
    id_customer:DataTypes.INTEGER,
    invoice_receipt_date: DataTypes.DATE,
    invoice_payment_date: DataTypes.DATE,
    invoice_deposit: DataTypes.BIGINT,
    invoice_total_payment: DataTypes.BIGINT,
    invoice_note:DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'invoice',
  });
  return invoice;
};