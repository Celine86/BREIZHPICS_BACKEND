const express = require('express'); 
const app = express();
const path = require("path");
//const db = require("./models/index");

// Sync Tables 
/*
db.sequelize.sync({ alter: true })
*/

// Create Admin account
/*
.then(function () {
  require("./conf/firstadmin");
});
*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
}); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/pics", express.static(path.join(__dirname, "pics")));
app.use("/defaultpics", express.static(path.join(__dirname, "defaultpics")));
app.use('/api/users', require('./routes/user'));

module.exports = app;