const db = require("../models"); 
const { Op } = require("sequelize");
const auth = require("../middleware/auth")
const fs = require("fs");


exports.deleteHPic = async (req, res, next) => {
    try {
        const userId = auth.getUserID(req);
        const user = await db.User.findOne({ where: { id: userId } });
        const thisPic = await db.Pic.findOne({ where: { id: req.params.id } });
        if ( user.role === "modo" || user.role === "admin") {
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
                picDeletedBy: user.id,
                UserId: user.id,
                userUsername: user.username,
                userEmail: user.email
            })
            next();    
        } else {
            res.status(400).json({ message: "Vous n'êtes pas autorisé à supprimer ce Post" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur Serveur" });
    }
};