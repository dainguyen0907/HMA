'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Privilege_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Privilege_detail.init({
    id_user: DataTypes.INTEGER,
    id_privilege: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Privilege_detail',
  });
  return Privilege_detail;
};