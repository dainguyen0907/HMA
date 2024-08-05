'use strict';
import {Model} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init({
    id_floor: DataTypes.INTEGER,
    room_name: DataTypes.STRING,
    room_bed_quantity: DataTypes.INTEGER,
    room_status: DataTypes.BOOLEAN,
    room_note:DataTypes.STRING,
    room_mark:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};