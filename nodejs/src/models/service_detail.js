'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Service_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Service_detail.init({
    id_bed: DataTypes.INTEGER,
    id_service: DataTypes.INTEGER,
    service_quantity: DataTypes.INTEGER,
    total_price: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Service_detail',
  });
  return Service_detail;
};