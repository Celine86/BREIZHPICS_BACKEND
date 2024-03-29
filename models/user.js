'use strict';
const {
  Model, Sequelize
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
      models.User.hasMany(models.Pic);
      models.User.hasMany(models.History);
      models.User.hasMany(models.Like);
    }
  };
  User.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {  type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    bio: {type: DataTypes.TEXT }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};