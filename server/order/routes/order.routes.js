/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/order.controller");

router.route("/").get(controller.getOrder);


router.route("/").post(controller.createOrder);

router.route("/:orderId").get(controller.getOrderById);

router.route("/:orderId").patch(controller.patchOrder);

router.route("/:orderId").delete(controller.deleteOrder);

module.exports = router;
