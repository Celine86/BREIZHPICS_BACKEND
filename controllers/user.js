const db = require("../models"); 
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.signup = async (req, res, next) => {
    if (req.body.username && req.body.email && req.body.password) {
      try {
        const user = await db.User.findOne({
          where: { [Op.or]: [{username: req.body.username}, {email: req.body.email}] },
        });
        if (user !== null) {
            return res.status(401).json({ error: "Ce pseudonyme ou cet email est déjà utilisé" });
        } else { 
            const hashed = await bcrypt.hash(req.body.password, 10)
            db.User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                role: "user",
                avatar: `${process.env.SERVERADDRESS}defaultpics/avatar.png`
            });
            res.status(201).json({ message: "Votre compte est créé. Vous pouvez vous connecter avec votre identifiant et mot de passe !" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
      }
    } else {
      return res.status(401).json({ error: "Vous devez renseigner tous les champs pour vous inscrire !" });
    }
};

exports.login = async (req, res, next) => {
    try {
      const user = await db.User.findOne({
        where: {username: req.body.username},
      });
      if (user === null) {
        return res.status(401).json({ error: "Connexion impossible, merci de vérifier votre login" });
      } else {
        const hashed = await bcrypt.compare(req.body.password, user.password);
        if (!hashed) {
          return res.status(401).json({ error: "Le mot de passe est incorrect !" });
        } else {
          res.status(200).json({
            message: "Vous êtes connecté",
            username: user.username,
            email: user.email,
            role: user.role,
            userId: user.id,
        })
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Erreur Serveur" });
    }
};