const express = require("express");

const router = express.Router();
const repoControl = require("../controllers/gallery.controller");

router.route("/").get(repoControl.getGallery);


module.exports = router;
