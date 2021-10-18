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
                //console.log({ message: `Le compte ${admin.username} a été créé!`});
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
        console.log("le compte existe déjà");
        //console.log({ message: "le compte existe déjà" });
      }
    })
    .catch((error) => {
      console.log(error);
      //console.log({ error });
    });
}
module.exports = firstAdmin();
