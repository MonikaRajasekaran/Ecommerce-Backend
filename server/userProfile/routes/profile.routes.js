/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/profile.controller");


router.route("/").get(controller.get);

router.route("/detail").get(controller.getAllProfile);

router.route("/:profileId").patch(controller.patch);

module.exports = router;
