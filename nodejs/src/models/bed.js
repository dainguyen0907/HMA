'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bed.init({
    id_room: DataTypes.INTEGER,
    id_customer: DataTypes.INTEGER,
    id_bed_type: DataTypes.INTEGER,
    id_invoice: DataTypes.INTEGER,
    bed_checkin: DataTypes.DATE,
    bed_checkout: DataTypes.DATE,
    bed_status: DataTypes.BOOLEAN,
    bed_deposit:DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Bed',
  });
  return Bed;
};