'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice.init({
    id_payment_method: DataTypes.INTEGER,
    id_customer:DataTypes.INTEGER,
    invoice_code:DataTypes.STRING,
    invoice_reception_name:DataTypes.STRING,
    invoice_receipt_date: DataTypes.DATE,
    invoice_payment_date: DataTypes.DATE,
    invoice_discount:DataTypes.BIGINT,
    invoice_deposit: DataTypes.BIGINT,
    invoice_total_payment: DataTypes.BIGINT,
    invoice_note:DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};