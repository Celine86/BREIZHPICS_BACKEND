const db = require("../models"); 
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const bcrypt = require('bcrypt');
require('dotenv').config();
const fs = require("fs");
const xss = require("xss");

exports.signup = async (req, res, next) => {
  if (req.body.username && req.body.email && req.body.password && req.body.verifyPassword) {
    try {
      const user = await db.User.findOne({
        where: { [Op.or]: [{username: req.body.username}, {email: req.body.email}] },
      });
      if (user !== null) {
          return res.status(401).json({ error: "Ce pseudonyme ou cet e-mail est déjà utilisé" });
      } else { 
        if (req.body.password === req.body.verifyPassword) {
          const hashed = await bcrypt.hash(req.body.password, 10)
          db.User.create({
              username: xss(req.body.username),
              email: xss(req.body.email),
              password: hashed,
              role: "user",
              avatar: `${req.protocol}://${req.get("host")}/defaultpics/avatar.jpg`,
              bio: "présentez-vous !"
          });
          res.status(201).json({ message: "Votre compte est créé. Vous pouvez vous connecter avec votre identifiant et mot de passe !" });
        } else {
          return res.status(401).json({ error: "Les mots de passe ne correspondent pas" });
        }
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
        if (user.status === true) {
            res.status(200).json({
              message: "Vous êtes connecté",
              username: user.username,
              email: user.email,
              role: user.role,
              userId: user.id,
              token: jwt.sign({userId: user.id}, process.env.TOKEN, {expiresIn: '24h'}),
          })
        } else {
          return res.status(401).json({ error: "Vous êtes temporairement banni" });
        }
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
    if (req.params.id === userId){
      if(!req.file && !req.body.username && !req.body.bio) {
        res.status(200).json({
          user: user,
          message: "Votre profil n'a pas été modifié",
        });
      } else {
        // Modification de l'avatar
          let newAvatar;
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
          // modification du pseudonyme
          if(req.body.username){
            user.username = xss(req.body.username)
          }
          // modification de la biographie
          if(req.body.bio){
            user.bio = xss(req.body.bio) 
          }
        // Enregistrement des modifications 
        const newUser = await user.save({ fields: ["avatar", "username", "bio"] });
        res.status(200).json({
          user: newUser,
          message: "Votre profil a bien été modifié",
        });
      }
    } else {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier ce profil" });
    }
  } catch (error) {
    console.log(error)
    //return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.modifyEmail = async (req, res, next) => {
  try {
    const userId = auth.getUserID(req);
    const user = await db.User.findOne({ where: { id: req.params.id } });
    if (req.params.id === userId){
      if(!req.body.email) {
        res.status(200).json({
          user: user,
          message: "Votre profil n'a pas été modifié",
        });
      } else {
        // Modification de l'avatar
        if(!req.file){
          console.log("L'utilisateur ne souhaite pas modifier son avatar")
        } else {
        // Modification de l'email
          let newEmail;
          const userExists = await db.User.findOne({
            where: {email: req.body.email},
          });
          if (userExists !== null) {
              return res.status(401).json({ error: "Cet e-mail est déjà utilisé" });
          } else { 
            newEmail = xss(req.body.email);
          }
          if (newEmail) {
            user.email = newEmail;
          }
        } 
        // Enregistrement des modifications 
        const newUser = await user.save({ fields: ["email"] });
        res.status(200).json({
          user: newUser,
          message: "Votre profil a bien été modifié",
        });
      }
    } else {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier ce profil" });
    }
  } catch (error) {
    console.log(error)
    //return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.modifyPassword = async (req, res, next) => {
  try {
    const userId = auth.getUserID(req);
    const user = await db.User.findOne({ where: { id: req.params.id } });
    if (req.params.id === userId){
      if(!req.body.password) {
        res.status(200).json({
          user: user,
          message: "Votre profil n'a pas été modifié",
        });
      } else { 
        // Modification du mot de passe 
        if (!req.body.password || !req.body.verifyPassword) {
          console.log("L'utilisateur ne souhaite pas modifier son mot de passe")
        }
        if (req.body.password && !req.body.verifyPassword) {
          return res.status(401).json({ error: "Merci de confirmer le mot d epasse" });
        } else if (req.body.password && req.body.password) {
          let newPassword;
          if (req.body.password === req.body.verifyPassword) {
            newPassword = await bcrypt.hash(req.body.password, 10)
          } else {
            return res.status(401).json({ error: "Les mots de passe ne correspondent pas" });
          }
          if (newPassword) {
            user.password = newPassword;
          }
        }
        // Enregistrement des modifications 
        const newUser = await user.save({ fields: ["password"] });
        res.status(200).json({
          user: newUser,
          message: "Votre profil a bien été modifié",
        });
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
    const user = await db.User.findOne({ attributes: ["id", "username", "email", "avatar", "bio"], where: { id: req.params.id } });
    res.status(200).json({userInfos : user});
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll({ attributes: ["id", "username", "email", "avatar", "createdAt"], where: { role: { [Op.not]: ["admin", "modo" ]} }, });
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.modoRank = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ attributes: ["id", "username", "email", "avatar", "role"], where: { id: req.params.id } }); 
    const userId = auth.getUserID(req); 
    const isAdmin = await db.User.findOne({ where: { id: userId } });
    if ((isAdmin.role === "admin") && (user.role === "user")) {
      user.role = "modo";
      await user.save({ fields: ["role"] });
      return res.status(200).json({ message: "Rôle de modérateur attribué" });
    } 
    if ((isAdmin.role === "admin") && (user.role === "modo")) {
      user.role = "user";
      await user.save({ fields: ["role"] });
      return res.status(200).json({ message: "Rôle de modérateur retiré" });
    }else {
      console.log(isAdmin.role);
      console.log(user.role);
      console.log(user);
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à faire cette action" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};

exports.ban = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ attributes: ["id", "username", "email", "avatar", "status"], where: { id: req.params.id } }); 
    const userId = auth.getUserID(req); 
    const isAdmin = await db.User.findOne({ where: { id: userId } });
    const isModo = await db.User.findOne({ where: { id: userId } })
    if ((isAdmin.role === "admin" || isModo.role === "modo") && user.status === true) {
      user.status = false;
      await user.save({ fields: ["status"] });
      return res.status(200).json({ message: "Utilisateur banni" });
    } 
    if ((isAdmin.role === "admin" || isModo.role === "modo") && user.status === false) {
      user.status = true;
      await user.save({ fields: ["status"] });
      return res.status(200).json({ message: "Utilisateur autorisé" });
    }else {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à faire cette action" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur Serveur" });
  }
};