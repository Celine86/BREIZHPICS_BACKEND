'use strict';
const {
  Model, //Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.History.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        }, onDelete: 'CASCADE',
      })
    }
  };
  History.init({
    picid: { type: DataTypes.UUID, allowNull: false },
    picUrl: { type: DataTypes.STRING, allowNull: true },
    picName: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    errorReportedBy: { type: DataTypes.STRING, allowNull: true },
    errorComment: { type: DataTypes.TEXT, allowNull: true },
    picModifiedBy: { type: DataTypes.STRING, allowNull: true },
    picDeletedBy: { type: DataTypes.STRING, allowNull: true },
    userUsername: { type: DataTypes.STRING, allowNull: true },
    userEmail: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};