const db = require("../models");
const bcrypt = require("bcrypt");
require('dotenv').config();

function firstAdmin(req, res) {
  db.User.findOne({ where: { email: "admin@breizhpics.bzh" } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(process.env.ADMINPASSWORD, 10)
          .then((hash) => {
            db.User.create({
              username: "admin",
              email: "admin@breizhpics.bzh",
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.png`,
              password: hash,
              role: "admin",
            })
              .then((account) => {
                console.log(`Le compte ${account.username} a été créé!`);
              })
              .catch((error) => { 
                console.log(error);
                res.status(400).json({ error });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ error });
          });
      } else {
        console.log("le compte admin existe déjà");
        //console.log({ message: "le compte existe déjà" });
      }
    })
    .catch((error) => {
      console.log(error);
      //console.log({ error });
    });
}
module.exports = firstAdmin();

function firstModo(req, res) {
  db.User.findOne({ where: { email: "modo@breizhpics.bzh" } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(process.env.MODOPASSWORD, 10)
          .then((hash) => {
            db.User.create({
              username: "modo",
              email: "modo@breizhpics.bzh",
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.png`,
              password: hash,
              role: "modo",
            })
              .then((account) => {
                console.log(`Le compte ${account.username} a été créé!`);
              })
              .catch((error) => { 
                console.log(error);
                res.status(400).json({ error });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ error });
          });
      } else {
        console.log("le compte modo existe déjà");
        //console.log({ message: "le compte existe déjà" });
      }
    })
    .catch((error) => {
      console.log(error);
      //console.log({ error });
    });
}
module.exports = firstModo();

function firstUser(req, res) {
  db.User.findOne({ where: { email: "toto@breizhpics.bzh" } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(process.env.USERPASSWORD, 10)
          .then((hash) => {
            db.User.create({
              username: "toto",
              email: "toto@breizhpics.bzh",
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.png`,
              password: hash,
              role: "user",
            })
              .then((account) => {
                console.log(`Le compte ${account.username} a été créé!`);
              })
              .catch((error) => { 
                console.log(error);
                res.status(400).json({ error });
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ error });
          });
      } else {
        console.log("le compte utilisateur existe déjà");
        //console.log({ message: "le compte existe déjà" });
      }
    })
    .catch((error) => {
      console.log(error);
      //console.log({ error });
    });
}
module.exports = firstUser();