const express = require("express");

const router = express.Router();
const hooksControl = require("../controllers/hooks.controller.js");

router.route("/").post(hooksControl.hooksPayload);

module.exports = router;
