'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Active_Token,{
        foreignKey: 'id'
      });
    }
  }
  User.init({
    id: {type:DataTypes.STRING, primaryKey: true, unique:true, required:true},
    password: {type:DataTypes.STRING,required:true},
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};