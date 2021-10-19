'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Car.init({
    model: DataTypes.STRING,
    brand: DataTypes.STRING,
    year: DataTypes.STRING,
    plate: DataTypes.STRING,
    dayly_price: DataTypes.STRING,
    drove_miles: DataTypes.FLOAT,
    isRented: DataTypes.BOOLEAN,
    birthdate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};