'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Pic.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        }, onDelete: 'CASCADE',
      })
    }
  };
  Pic.init({
    id: { type: DataTypes.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    picUrl: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    beforeSubmission: { type: DataTypes.BOOLEAN, allowNull:false, defaultValue: true },
    errorReported: { type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false },
    modifiedBy: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'Pic',
  });
  return Pic;
};