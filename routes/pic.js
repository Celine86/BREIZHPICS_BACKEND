const express = require('express'); 
const router = express.Router();
const ctrlpic = require("../controllers/pic");
const ctrlhistory = require("../controllers/history");
const auth = require("../middleware/auth");
const pic = require("../middleware/pic");


router.post("/create", auth.signin, pic.fileUpload, ctrlpic.createPic);
router.put("/modify/:id", auth.signin, pic.fileUpload, ctrlpic.modifyPic);
router.delete("/delete/:id", auth.signin, ctrlhistory.deleteHPic, ctrlpic.deletePic);
router.get("/location/", auth.signin, ctrlpic.getAllPicsByLocation);
router.get("/description/", auth.signin, ctrlpic.getAllPicsByDescription);
router.put("/validate/:id", auth.signin, ctrlpic.validatePic);
router.get("/picstovalidate/", auth.signin, ctrlpic.getAllPicsToValidate);
router.get("/reportedpics/", auth.signin, ctrlpic.getAllReportedPics);


module.exports = router;