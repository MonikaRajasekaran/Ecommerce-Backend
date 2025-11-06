/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/menuItem.controller");

router.route("/").get(controller.getmenuItem);

router.route("/popular").get(controller.getPopularItems);


router.route("/").post(controller.createmenuItem);

router.route("/:menuItemId").get(controller.getmenuItemById);

router.route("/:menuItemId").patch(controller.patchmenuItem);

router.route("/:menuItemId").delete(controller.deletemenuItem);

module.exports = router;
