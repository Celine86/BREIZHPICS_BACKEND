const express = require('express'); 
const router = express.Router();
const ctrl = require("../controllers/user");
const check = require("../middleware/check");
const pic = require("../middleware/file");
const auth = require("../middleware/auth");

router.post("/signup", check.mail, check.password, ctrl.signup);
router.post("/login", ctrl.login);
router.put("/profils/:id", auth.signin, pic.fileUpload, ctrl.modifyAccount);

module.exports = router;