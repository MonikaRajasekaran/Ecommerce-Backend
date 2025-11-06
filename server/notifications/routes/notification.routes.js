/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const notificationsController = require("../controllers/notifications.controller");
const notificationsValidator = require("../../middleware/validators/notifications.validator");
const error = require("../../middleware/validators/error.validator");


module.exports = router;
