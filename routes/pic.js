const express = require('express'); 
const router = express.Router();
const ctrlpic = require("../controllers/pic");
const ctrlhistory = require("../controllers/history");
const auth = require("../middleware/auth");
const pic = require("../middleware/pic");


router.post("/create", auth.signin, pic.fileUpload, ctrlpic.createPic);
router.put("/modify/:id", auth.signin, pic.fileUpload, ctrlhistory.modifyHPic, ctrlpic.modifyPic);
router.delete("/delete/:id", auth.signin, ctrlhistory.deleteHPic, ctrlpic.deletePic);

router.get("/all", ctrlpic.getAllPics);
router.get("/all/:id", auth.signin,ctrlpic.getOnePic);
router.post("/search", ctrlpic.getAllPicsByLocationOrDescription);

router.put("/validate/:id", auth.signin, ctrlpic.validatePic);
router.put("/unreport/:id", auth.signin, ctrlpic.validatePic, ctrlpic.modifyPic);

router.get("/picstovalidate", auth.signin, ctrlpic.getAllPicsToValidate);
router.get("/reportedpics", auth.signin, ctrlpic.getAllReportedPics);

router.put("/report/:id", auth.signin, ctrlpic.reportPic, ctrlhistory.reportHPic);

router.post("/like/:id", auth.signin, ctrlpic.addLike);

module.exports = router;