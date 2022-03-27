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
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.jpg`,
              password: hash,
              bio: "présentez-vous !",
              role: "admin",
            })
              .then((account) => {
                console.log(`Le compte ${account.username} a été créé!`)
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
      }
    })
    .catch((error) => {
      console.log(error);
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
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.jpg`,
              password: hash,
              bio: "présentez-vous !",
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
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
module.exports = firstModo();

function firstUser(req, res) {
  db.User.findOne({ where: { email: "breizhpics@breizhpics.bzh" } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(process.env.USERPASSWORD, 10)
          .then((hash) => {
            db.User.create({
              username: "breizhpics",
              email: "breizhpics@breizhpics.bzh",
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.jpg`,
              password: hash,
              bio: "présentez-vous !",
              role: "user",
            })
            .then((account) => {
                console.log(`Le compte ${account.id} a été créé!`)
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Brehat_RetourVersLArcouest.jpg`,
                  picName: "Brehat_RetourVersLArcouest",
                  location: "Brehat",
                  description: "De retour à L'Arcouest",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Plouha_PlageDuPalus.jpg`,
                  picName: "Plouha_PlageDuPalus",
                  location: "Plouha",
                  description: "Plage du Palus",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Belle-Ile_PlageDesGrandsSables.jpg`,
                  picName: "Belle-Ile_PlageDesGrandsSables",
                  location: "Belle-Ile",
                  description: "Près de la Plage des Grands Sables",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Plouezec_MoulinDeCraca.jpg`,
                  picName: "Plouezec_MoulinDeCraca",
                  location: "Plouezec",
                  description: "Moulin de Craca",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Quiberon_CoteSauvage.jpg`,
                  picName: "Quiberon_CoteSauvage",
                  location: "Quiberon",
                  description: "Côte Sauvage",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Brehat_PhareDuPaon.jpg`,
                  picName: "Brehat_PhareDuPaon",
                  location: "Brehat",
                  description: "Le Phare du Paon",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/Brehat_EntreBrehatEtLArcouest.jpg`,
                  picName: "Brehat_EntreBrehatEtLArcouest",
                  location: "Brehat",
                  description: "Entre Brehat et L'Arcouest",
                  beforeSubmission: false,
                  UserId: account.id,
                })
              })
              .catch((error) => { 
                console.log(error);
                res.status(400).json({ error });
              }) 
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ error });
          });
      } else {
        console.log("le compte utilisateur existe déjà");
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
module.exports = firstUser()