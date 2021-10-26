const express = require('express'); 
const router = express.Router();
const ctrl = require("../controllers/pic");
const auth = require("../middleware/auth");
const pic = require("../middleware/pic");

router.post("/create", auth.signin, pic.fileUpload, ctrl.createPic);
router.put("/modify/:id", auth.signin, pic.fileUpload, ctrl.modifyPic);
router.delete("/delete/:id", auth.signin, ctrl.deletePic);
router.get("/location/", auth.signin, ctrl.getAllPicsByLocation);
router.get("/description/", auth.signin, ctrl.getAllPicsByDescription);

module.exports = router;