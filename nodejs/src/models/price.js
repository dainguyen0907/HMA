'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Price.init({
    id_bed_type: DataTypes.INTEGER,
    price_name: DataTypes.STRING,
    price_hour: DataTypes.BIGINT,
    price_day: DataTypes.BIGINT,
    price_week: DataTypes.BIGINT,
    price_month: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};