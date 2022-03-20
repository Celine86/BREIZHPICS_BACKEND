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
              //avatar: `${req.protocol}://${req.get("host")}/defaultpics/avatar.jpg`,
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
              //avatar: `${req.protocol}://${req.get("host")}/defaultpics/avatar.jpg`,
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
              //avatar: `${req.protocol}://${req.get("host")}/defaultpics/avatar.jpg`,
              avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.jpg`,
              password: hash,
              bio: "présentez-vous !",
              role: "user",
            })
            .then((account) => {
                console.log(`Le compte ${account.id} a été créé!`)
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/firstpic.JPG`,
                  picName: "firstpic",
                  location: "Brehat",
                  description: "De retour à l'Arcouest",
                  beforeSubmission: false,
                  UserId: account.id,
                })
                db.Pic.create({
                  picUrl: `${process.env.SERVERADDRESS}defaultpics/secondpic.jpg`,
                  picName: "secondpic",
                  location: "Plouha",
                  description: "Plage du Palus",
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


/*
async function firstPic(req, res) {
  const breizhpics = await db.User.findOne({ where: { email: "breizhpics@breizhpics.bzh" } })
  //console.log(breizhpics.id)
  const firstpic = await db.Pic.findOne({ where: { isFirst: true } })
  //console.log(firstpic.isFirst)
      if (firstpic) {
        console.log("le post existe déjà");
      } else {
        db.Pic.create({
          picUrl: `${process.env.SERVERADDRESS}defaultpics/firstpic.JPG`,
          picName: "firstpic",
          location: "Brehat",
          description: "De retour à l'Arcouest",
          beforeSubmission: false,
          UserId: breizhpics.id,
          isFirst: 1
        })
          .then(() => {
            console.log(`Le post a été créé!`);
          })
          .catch(() => { 
            console.log("error");
            //res.status(400).json({ error });
          });
      }
}
module.exports = firstPic()
*/