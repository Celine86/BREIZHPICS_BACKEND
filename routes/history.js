const express = require('express'); 
const router = express.Router();
const ctrlhistory = require("../controllers/history");
const auth = require("../middleware/auth");

router.get("/allHistory", auth.signin, ctrlhistory.getAllHistory);

module.exports = router;