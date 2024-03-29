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
                  return res.status(403).json({ message: "Merci de renseigner le lieu et la description" });
                }); //Si une image est ajouté et que la requête est en erreur, l'image sera quand même dans le folder, donc on évite cela
                return res.status(403).json({ message: "Merci de renseigner le lieu et la description" });
            } else {
                const myPic = await db.Pic.create({
                    location: xss(req.body.location),
                    description: xss(req.body.description),
                    picName: picName,
                    picUrl: picUrl,
                    UserId: user.id
                }); 
                return res.status(200).json({ post: myPic, message: "Le post a été ajouté et, s'il est conforme, sera visible sous 24h" });
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
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } 
        });
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
                thisPic.picUrl = newPicUrl;
            }
            if (req.body.location) {
                thisPic.location = xss(req.body.location);
            }
            if (req.body.description) {
                thisPic.description = xss(req.body.description);
            }
            if (userId === thisPic.UserId) {
                thisPic.beforeSubmission = true;
            } else {
                thisPic.beforeSubmission = false;
            }
            thisPic.modifiedBy = hasModified.username;
            const newPic = await thisPic.save({
                fields: ["location", "description", "picUrl", "modifiedBy", "beforeSubmission"],
            });
            if (userId === thisPic.UserId) {
                res.status(200).json({ newPost: newPic, message: "Le post a été modifié et est en attente de validation" });
            } else {
                res.status(200).json({ newPost: newPic, message: "Le post a été modifié" });
            }  
        } 
        else {
        res.status(400).json({ message: "Vous n'êtes pas autorisé à modifier ce post" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur Modify" });
    }
};

exports.deletePic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req)
        const isModo = await db.User.findOne({ where: { id: userId } })
        const isAdmin = await db.User.findOne({ where: { id: userId } })
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } 
        });
        if (userId === thisPic.UserId || isModo.role === "modo" || isAdmin.role === "admin") {
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


exports.getAllPicsByLocationOrDescription = async (req, res, next) => {
    try {
        if(req.body.location && !req.body.description) {
            const pics = await db.Pic.findAll({ 
                limit: 50, order: [["id", "DESC"]],
                where: { location: req.body.location, before_submission: 0, error_reported: 0 }, 
                limit: 10, order: [["created_at", "DESC"]],
                //attributes: ["id", "location", "description", "picUrl", "createdAt", "updatedAt"],
                //attributes: ["id", "picUrl", "picName", "location", "description", "beforeSubmission", "validatedBy", "errorReported", "unreportedBy", "modifiedBy", "createdAt", "updatedAt", "userId"],
                include: [
                    {model: db.User, attributes: ["username", "avatar"]},
                    {model: db.Like, include: [{model: db.User, attributes: ["username"]}]}
                ],
            });
            if(pics.length !== 0) {
                res.status(200).json(pics);
            } else {
                res.status(200).json({ message: "Pas de photographie disponible" });
            }
        }
        if(req.body.description && !req.body.location) {
            const pics = await db.Pic.findAll({ 
                limit: 50, order: [["id", "DESC"]],
                where: { description: { [Op.like]: `%${req.body.description}%` }, before_submission: 0, error_reported: 0 }, 
                limit: 10,
                order: [["created_at", "DESC"]],
                //attributes: ["id", "location", "description", "picUrl"],
                include: [
                    {model: db.User, attributes: ["username", "avatar"]},
                    {model: db.Like, include: [{model: db.User, attributes: ["username"]}]}
                ]
            });
            if(pics.length !== 0) {
                res.status(200).json(pics);
            } else {
                res.status(200).json({ message: "Pas de photographie disponible" });
            }
        }
        if(req.body.location && req.body.description) {
            const pics = await db.Pic.findAll({ 
                limit: 50, order: [["id", "DESC"]],
                where: { description: { [Op.like]: `%${req.body.description}%` }, location: req.body.location, before_submission: 0, error_reported: 0 }, 
                limit: 10,
                order: [["created_at", "DESC"]],
                //attributes: ["id", "location", "description", "picUrl"],
                include: [
                    {model: db.User, attributes: ["username", "avatar"]},
                    {model: db.Like, include: [{model: db.User, attributes: ["username"]}]}
                ]
            });
            if(pics.length !== 0) {
                res.status(200).json(pics);
            } else {
                res.status(200).json({ message: "Pas de photographie disponible" });
            }
        }
        else if(!req.body.description && !req.body.location) {
            res.status(200).json({ message: "Merci de renseigner un lieu ou un mot-clé" });
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
        const picsToValidate = await db.Pic.findAll({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { beforeSubmission: true } });
        if (isModo.role === "modo" || isAdmin.role === "admin") {
            res.status(200).json({ picsToValidate });
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à afficher cette page" });
        }
    } catch {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.validatePic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const hasValidate = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } });
        if ((isModo.role === "modo" || isAdmin.role === "admin") && (thisPic.beforeSubmission === true || thisPic.errorReported === true)) {
            if (thisPic.beforeSubmission === true) {
                thisPic.beforeSubmission = false;
                thisPic.validatedBy = hasValidate.username;
                const newPic = await thisPic.save({ fields: ["beforeSubmission", "validatedBy"] });
                return res.status(200).json({ newPost: newPic, message: "Le Post a été validé" });
            }
            /*if (thisPic.errorReported === true) {
                if (req.body.location) {
                    thisPic.location = xss(req.body.location);
                }
                if (req.body.description) {
                    thisPic.description = xss(req.body.description);
                }
                thisPic.errorReported = false;
                thisPic.unreportedBy = hasValidate.username;
                const newPic = await thisPic.save({ fields: ["location", "description", "errorReported", "unreportedBy"] });
                return res.status(200).json({ newPost: newPic, message: "Le Post a été validé" });
            }*/
        } 
        else {
            if (isModo.role === "modo" || isAdmin.role === "admin") {
                return res.status(400).json({ message: "Ce post est déjà validé" });
            } else {
                return res.status(400).json({ message: "Vous n'êtes pas autorisé à valider ce post" });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

/*exports.reportPic = async (req, res, next) => {
    try {
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } });
        if (thisPic.errorReported === false) {
            thisPic.errorReported = true;
            await thisPic.save({ fields: ["errorReported"] });
            next();
        } else {
            return res.status(200).json({ message: "L'erreur a déjà été signalée, merci de votre attention"});
        }
    } catch {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};*/

/*exports.getAllReportedPics = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const reportedPics = await db.Pic.findAll({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { errorReported: true } });
        if (isModo.role === "modo" || isAdmin.role === "admin") {
            res.status(200).json({ reportedPics });
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à afficher cette page" });
        }
    } catch {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};*/

exports.getAllPics = async (req, res, next) => {
    try {
        const allPics = await db.Pic.findAll({
            limit: 50, order: [["id", "DESC"]], 
            include: [
                {model: db.User, attributes: ["username", "avatar"]},
                {model: db.Like, attributes: ["UserId"]}
            ],
            where: { [Op.and]: [{ errorReported: false }, {beforeSubmission: false}] }
        })
            res.status(200).json({ allPics });
    } catch {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.getOnePic = async (req, res, next) => {
    try {
        const pic = await db.Pic.findOne({ 
            include: [
                {model: db.User, attributes: ["username", "avatar", "id"]},
                {model: db.Like, attributes: ["UserId"]}
            ],
            where: { [Op.and]: [{id: req.params.id}, { errorReported: false }, {beforeSubmission: false}] }

        });
        res.status(200).json(pic);
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.addLike = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const picId = req.params.id;
        const userLiked = await db.Like.findOne({ where: { UserId: userId, PicId: picId }, });
        if (userLiked) {
            await db.Like.destroy(
                { where: { UserId: userId, PicId: picId } },
                { truncate: true, restartIdentity: true }                
            );
            res.status(200).json({ message: "Vous n'aimez plus ce post :(" });
        } else {
            await db.Like.create({
                UserId: userId,
                PicId: picId,
            });
            res.status(200).json({ message: "Vous aimez ce post !" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};