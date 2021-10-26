'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
/*
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
*/
const db = {};

require('dotenv').config();
// Configuration de la connexion à la BDD, les informations sont ainsi stockées dans .env
let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  define: {
    underscored: true,
    freezeTableName: true, 
    timestamps: true,  
  },
  dialectOptions: {
    useUTC: false, 
    dateStrings: true,
    typeCast: function (field, next) {
      if (field.type === 'DATETIME') {
        return field.string()
      }
        return next()
    },
  },
  timezone: process.env.TIMEZONE
});

/*
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
*/

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
