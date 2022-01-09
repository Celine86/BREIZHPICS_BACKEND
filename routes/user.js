const express = require('express'); 
const router = express.Router();
const ctrl = require("../controllers/user");
const check = require("../middleware/check");
const avatar = require("../middleware/avatar");
const auth = require("../middleware/auth");

router.post("/signup", check.mail, check.password, ctrl.signup);
router.post("/login", ctrl.login);
router.put("/profils/modifyAccount/:id", auth.signin, avatar.fileUpload, ctrl.modifyAccount);
router.put("/profils/modo/:id", auth.signin, ctrl.modoRank);
router.put("/profils/ban/:id", auth.signin, ctrl.ban);
router.delete("/profils/:id", auth.signin, ctrl.deleteAccount);
router.get("/profils/:id", auth.signin, ctrl.getOneUser);
router.get("/profils", auth.signin, ctrl.getAllUsers);

module.exports = router;