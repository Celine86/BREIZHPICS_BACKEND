const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './pics');
    },
    filename: (req, file, callback) => {
        callback(null, "breizhpic" + '_' + Date.now());
    }
});

let fileFilter = function (req, file, cb) {
    var allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb({
            success: false,
            message: 'Type de fichier invalide. Seuls les jpeg, jpg et png sont autorisés'
        }, false);
    }
};
let obj = {
    storage: storage,
    limits: {
        fileSize: 200000
    },
    fileFilter: fileFilter
};
const upload = multer(obj).single('file'); 

exports.fileUpload = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.status(500);
            if (error.code == 'LIMIT_FILE_SIZE') {
                error.message = 'Cette image dépasse la taille limite de 200Mo';
                error.success = false;
            }
            return res.json(error);
        } else {
            if (!req.file) {
                res.status(500);
                res.json('Aucune fichier trouvé');
            }
            next();
        }
    })
};
