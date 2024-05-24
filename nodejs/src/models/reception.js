'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Reception extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reception.init({
    reception_account: DataTypes.STRING,
    reception_password: DataTypes.TEXT,
    reception_name: DataTypes.STRING,
    reception_email: DataTypes.STRING,
    reception_phone: DataTypes.STRING,
    reception_status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Reception',
  });
  return Reception;
};