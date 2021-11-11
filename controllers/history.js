const db = require("../models"); 
const auth = require("../middleware/auth");
const fs = require("fs");
const xss = require("xss");

exports.deleteHPic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } 
        });
        if ( user.role === "admin" || userId === thisPic.UserId) {
            fs.copyFile(`./pics/${thisPic.picName}`, `./picshistory/${thisPic.picName}`, (error) => {
                if (error) {
                  console.log(error)
                }
                else {
                  console.log("Image copiée")
                }
            })
            let picUrl = `${req.protocol}://${req.get('host')}/picshistory/${thisPic.picName}`;
            await db.History.create({
                picid: thisPic.id,
                picUrl: picUrl,
                picName: thisPic.picName,
                location: thisPic.location,
                description: thisPic.description,
                createdBy: thisPic.User.username,
                picDeletedBy: user.username,
                UserId: user.id,
                userUsername: user.username,
                userEmail: user.email,
                historyReason: "deleted"
            })
            next();    
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer ce Post" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};

exports.modifyHPic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } 
        });
        if (userId === thisPic.UserId || isModo.role === "modo" || isAdmin.role === "admin") {
            fs.copyFile(`./pics/${thisPic.picName}`, `./picshistory/${thisPic.picName}`, (error) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log("Image copiée")
                }
            })
            let picUrl = `${req.protocol}://${req.get('host')}/picshistory/${thisPic.picName}`;
            await db.History.create({
                picid: thisPic.id,
                picUrl: picUrl,
                picName: thisPic.picName,
                location: thisPic.location,
                description: thisPic.description,
                createdBy: thisPic.User.username,
                picModifiedBy: user.username,
                UserId: user.id,
                userUsername: user.username,
                userEmail: user.email,
                historyReason: "modified"
            })
            next();
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
}

exports.getAllHistory = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const isModo = await db.User.findOne({ where: { id: userId } });
        const isAdmin = await db.User.findOne({ where: { id: userId } });
        const history = await db.History.findAll();
        if(isModo.role === "modo" || isAdmin.role === "admin") {
            res.status(200).json({ pics: history });
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à afficher cette page" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });        
    } 
};


exports.reportHPic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ 
            include: [{model: db.User, attributes: ["username"]}],
            where: { id: req.params.id } 
        });
            if (thisPic.reportReason = true) {
                fs.copyFile(`./pics/${thisPic.picName}`, `./picshistory/${thisPic.picName}`, (error) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log("Image copiée")
                    }
                })
                let picUrl = `${req.protocol}://${req.get('host')}/picshistory/${thisPic.picName}`;
                await db.History.create({
                    picid: thisPic.id,
                    picUrl: picUrl,
                    picName: thisPic.picName,
                    location: thisPic.location,
                    description: thisPic.description,
                    createdBy: thisPic.User.username,
                    errorReportedBy: user.username,
                    errorComment: xss(req.body.errorComment),
                    UserId: user.id,
                    userUsername: user.username,
                    userEmail: user.email,
                    historyReason: "reported"
                })
                return res.status(200).json({message : "L'erreur a été signalée, merci de votre attention"});
            }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};
