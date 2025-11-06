const express = require("express");

const router = express.Router();
const unitController = require("../controllers/units.controller");

router.route("/").get(unitController.getUnit);

router.route("/").post(unitController.createUnit);


router.route("/:unitId").get(unitController.getUnitById);

router.route("/:unitId").patch(unitController.patchUnit);

router.route("/:unitId").delete(unitController.deleteUnit);

module.exports = router;
