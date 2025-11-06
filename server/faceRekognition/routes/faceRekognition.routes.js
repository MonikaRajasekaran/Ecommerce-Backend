const express = require("express");

const router = express.Router();
const RekoControl = require("../controllers/faceRekognition.controller");
const upload = require("../../middleware/multer.middleware");

router.route("/collection").post(RekoControl.createCollection);

router.route("/faces").post(RekoControl.registerFace);

router.route("/faces").delete(RekoControl.deleteFaces);

router.route("/faceMatch").post(upload.single("file"), RekoControl.compareFace);

module.exports = router;
