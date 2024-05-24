'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class invoice_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invoice_detail.init({
    id_invoice: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    product_value: DataTypes.FLOAT,
    product_total_price: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'invoice_detail',
  });
  return invoice_detail;
};