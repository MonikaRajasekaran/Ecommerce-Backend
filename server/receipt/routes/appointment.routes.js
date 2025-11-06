/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/appointment.controller");

router.route("/").get(controller.get);

router.route("/").post(controller.create);

router.route("/:scheduleId").patch(controller.patch);

router.route("/:scheduleId").delete(controller.delete);

module.exports = router;
