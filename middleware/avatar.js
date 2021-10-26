const multer = require('multer');
const auth = require("../middleware/auth");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './avatars');
    },
    filename: async (req, file, callback) => {
        const author = await auth.getUserUsername(req);
        const extension = MIME_TYPES[file.mimetype];
        callback(null, author + '_' + Date.now() + '.' + extension);
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
        fileSize: 1000000
    },
    fileFilter: fileFilter
};
const upload = multer(obj).single('file'); 

exports.fileUpload = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.status(500);
            if (error.code == 'LIMIT_FILE_SIZE') {
                error.message = 'Cet avatar dépasse la taille limite de 1Mo';
                error.success = false;
            }
            return res.json(error);
        } else {
            if (!req.file) {
                res.status(500);
                res.json('Aucun fichier trouvé');
            }
            next();
        }
    })
};