const express = require('express'); 
const router = express.Router();
const ctrl = require("../controllers/user");
const check = require("../middleware/check");
const avatar = require("../middleware/avatar");
const pic = require("../middleware/pic");
const auth = require("../middleware/auth");

router.post("/signup", check.mail, check.password, ctrl.signup);
router.post("/login", ctrl.login);
router.put("/profils/:id", auth.signin, avatar.fileUpload, ctrl.modifyAccount);
router.delete("/profils/:id", auth.signin, ctrl.deleteAccount);
router.get("/profils/:id", auth.signin, ctrl.getOneUser);
router.get("/profils", auth.signin, ctrl.getAllUsers);

module.exports = router;