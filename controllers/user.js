const db = require("../models"); 
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const bcrypt = require('bcrypt');
require('dotenv').config();
const fs = require("fs");
const xss = require("xss");

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
              username: xss(req.body.username),
              email: xss(req.body.email),
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
          //message: "Vous êtes connecté",
          username: user.username,
          email: user.email,
          role: user.role,
          userId: user.id,
          token: jwt.sign({userId: user.id}, process.env.TOKEN, {expiresIn: '24h'})
      })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.modifyAccount = async (req, res, next) => {
  try {
    const userId = auth.getUserID(req);
    const user = await db.User.findOne({ where: { id: req.params.id } });
    let newAvatar;
    if (req.params.id === userId){
      if (req.file && user.avatar) {
        newAvatar = `${req.protocol}://${req.get("host")}/avatars/${
          req.file.filename
        }`;
      const filename = user.avatar.split("/avatars")[1];
        fs.unlink(`avatars/${filename}`, (err) => {
          if (err) console.log(err);
          else { console.log(`Image Supprimée: avatars/${filename}`); }
        });
    } else if (req.file) {
      newAvatar = `${req.protocol}://${req.get("host")}/avatars/${
        req.file.filename
      }`;
    }
    if (newAvatar) {
      user.avatar = newAvatar;
    }
    const newUser = await user.save({ fields: ["avatar"] });
    res.status(200).json({
      user: newUser,
      message: "Votre avatar a bien été modifié",
    });
    if (!req.file) {
      return res.status(403).json({ error: "Toto" });
    }
    } else {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier ce profil" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
      const userId = auth.getUserID(req);
      const isAdmin = await db.User.findOne({ where: { id: userId } }); 
      const user = await db.User.findOne({ where: { id: req.params.id } });
      if (req.params.id === userId || isAdmin.role === "admin"){
      if (user.avatar !== null) {
        const filename = user.avatar.split("/avatars")[1];
        fs.unlink(`avatars/${filename}`, () => {
          db.User.destroy({ where: { id: req.params.id } });
          res.status(200).json({ message: "Le compte a été supprimé" });
        });
        } else {
          db.User.destroy({ where: { id: req.params.id } });
          res.status(200).json({ message: "Le compte a été supprimé" });
        }
    } else {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer ce compte" });
    } 
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ attributes: ["id", "username", "email", "avatar"],
    where: { id: req.params.id } });
    res.status(200).json({userInfos : user});
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll({ attributes: ["id", "username", "email", "avatar"],
    where: { role: { [Op.ne]: "admin", } }, });
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};