const express = require("express");
const configController = require("../controllers/configurations.controller");
const validator = require("../../middleware/validators/config.validator");
const error = require("../../middleware/validators/error.validator");

const router = express.Router();

router.route("/").get(configController.getConfigurationData);

router.route("/").post(configController.create);

module.exports = router;
