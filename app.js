const express = require('express'); 
const app = express();
const path = require("path");
//const db = require("./models/index");

// Sync Tables 
//db.sequelize.sync()

// Sync Tables and force modifications 
// db.sequelize.sync({ alter: true, force: false })
// Note, set force to true if error "Too many keys specified; max 64 keys allowed"

// Create Admin and Modo account
/*
.then(function () {
  require("./conf/firstadminandmodo");
  firstAdmin();
  firstModo();
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
app.use("/avatars", express.static(path.join(__dirname, "avatars")));
app.use("/defaultpics", express.static(path.join(__dirname, "defaultpics")));
app.use('/api/users', require('./routes/user'));
app.use('/api/pics', require('./routes/pic'));

module.exports = app;