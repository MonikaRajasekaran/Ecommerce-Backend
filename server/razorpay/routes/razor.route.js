/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/razor.controller");

router.route("/customer").post(controller.createCustomer);

router.route("/order").post(controller.createOrder);

router.route('/subscription').post(controller.createSubscription)
router.route('/verify').post(controller.verifyPayment);
router.route("/order/all").get(controller.getAllOrder);
router.route("/customer/:customerId").get(controller.getCustomer);
router.route("/order/:orderId").get(controller.getOrder);
router.route("/status/:rzpayid").get(controller.getPaymentByOrder);

module.exports = router;
