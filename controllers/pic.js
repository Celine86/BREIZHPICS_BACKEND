const db = require("../models"); 
const { Op } = require("sequelize");
const auth = require("../middleware/auth")
const fs = require("fs");
const xss = require("xss");

exports.createPic = async (req, res, next) => {
    try {
        let picUrl = "";
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        if(user !== null) { 
            if (req.file) {
                picName = req.file.filename
                picUrl = `${req.protocol}://${req.get('host')}/pics/${req.file.filename}`;
            } else {
                return res.status(403).json({ message: "Merci de rajouter une photographie" });
            }
            if(!req.body.location || !req.body.description){
                fs.unlink(`pics/${req.file.filename}`, () => {
                  res.status(403).json({ message: "Merci de renseigner le lieu et la description" });
                }); //Si une image est ajouté et que la requête est en erreur, l'image sera quand même dans le folder, donc on évite cela
                res.status(403).json({ message: "Merci de renseigner le lieu et la description" });
            } else {
                const myPic = await db.Pic.create({
                    location: xss(req.body.location),
                    description: xss(req.body.description),
                    picName: picName,
                    picUrl: picUrl,
                    UserId: user.id
                }); 
                res.status(200).json({ post: myPic, message: "Post ajouté" });
            }
        }
        else {
            return res.status(403).json({ error: "Le post n'a pas pu être ajouté" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.modifyPic = async (req, res, next) => {
    try {
        let newPicUrl;
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const hasModified = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ where: { id: req.params.id } });
        if (userId === thisPic.UserId || isModo.role === "modo" || isAdmin.role === "admin") {
            if (req.file) {
                newPicUrl = `${req.protocol}://${req.get("host")}/pics/${req.file.filename}`;
                if (thisPic.picUrl) {
                    const filename = thisPic.picUrl.split("/pics")[1];
                    fs.unlink(`pics/${filename}`, (err) => {
                    if (err) console.log(err);
                    else { console.log(`image supprimée: pics/${filename}`); }
                    });
                }
            }
            if (req.body.location) {
                thisPic.location = xss(req.body.location);
            }
            if (req.body.description) {
                thisPic.description = xss(req.body.description);
            }
            thisPic.modifiedBy = hasModified.username;
            thisPic.picUrl = newPicUrl;
            const newPic = await thisPic.save({
                fields: ["location", "description", "picUrl", "modifiedBy"],
            });
            res.status(200).json({ newPost: newPic, message: "Le Post a été modifié" });
        } 
        else {
        res.status(400).json({ message: "Vous n'êtes pas autorisé à modifier ce post" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};


exports.deletePic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req)
        const isAdmin = await db.User.findOne({ where: { id: userId } })
        const thisPic = await db.Pic.findOne({ where: { id: req.params.id } })
        if (userId === thisPic.UserId || isAdmin.role === "admin") {
            const filename = thisPic.picUrl.split("/pics")[1];
            fs.unlink(`pics/${filename}`, () => {
                db.Pic.destroy({ where: { id: thisPic.id } });
                res.status(200).json({ message: "Le Post a été supprimé" });
            })
        } else {
        res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer ce Post" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.getAllPicsByLocation = async (req, res, next) => {
    try {
        if(!req.body.location) {
            res.status(200).json({ message: "Merci de renseigner un lieu" });
        } else {
            const pics = await db.Pic.findAll({ 
                where: { location: req.body.location, before_submission: 0 }, 
                limit: 10,
                order: [["created_at", "DESC"]],
                attributes: ["id", "location", "description", "picUrl", "createdAt", "updatedAt"]
            });
            if(pics.length !== 0) {
                res.status(200).json(pics);
            } else {
                res.status(200).json({ message: "Pas de photographie disponible" });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });        
    }
};

exports.getAllPicsByDescription = async (req, res, next) => {
    try {
        if(!req.body.description) {
            res.status(200).json({ message: "Merci de renseigner un lieu" });
        } else {
            const pics = await db.Pic.findAll({ 
                where: { description: { [Op.like]: `%${req.body.description}%` }, before_submission: 0, error_reported: 0 }, 
                limit: 10,
                order: [["created_at", "DESC"]],
                attributes: ["id", "location", "description", "picUrl"]
            });
            if(pics.length !== 0) {
                res.status(200).json(pics);
            } else {
                res.status(200).json({ message: "Pas de photographie disponible" });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });        
    }
};

exports.validatePic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const hasValidate = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ where: { id: req.params.id } });
        if (isModo.role === "modo" || isAdmin.role === "admin") {
            if (req.body.beforeSubmission) {
                thisPic.beforeSubmission = req.body.beforeSubmission;
            }
            thisPic.validatedBy = hasValidate.username;
            const newPic = await thisPic.save({
                fields: ["beforeSubmission", "validatedBy"],
            });
            res.status(200).json({ newPost: newPic, message: "Le Post a été validé" });
        } 
        else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à valider ce post" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.getAllPicsToValidate = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const picsToValidate = await db.Pic.findAll({ where: { beforeSubmission: true } });
        if (isModo.role === "modo" || isAdmin.role === "admin") {
            res.status(200).json({ pics: picsToValidate });
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à afficher cette page" });
        }
    } catch {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.getAllReportedPics = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const reportedPics = await db.Pic.findAll({ where: { errorReported: true } });
        if (isModo.role === "modo" || isAdmin.role === "admin") {
            res.status(200).json({ pics: reportedPics });
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à afficher cette page" });
        }
    } catch {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

