/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/users.controller");

router.route("/auth").post(controller.authenticate);

router.route("/account/code/verify").patch(controller.confirmAccount);

router.route("/account/code/retry").post(controller.retryCode);

router.route("/register").post(controller.register);

router.route("/forgot/password").post(controller.ForgotPassword);

router.route("/reset/password").patch(controller.resetPassowrd);

router.route("/update/password").patch(controller.updatePassword);

router.route("/auth/refresh").post(controller.refreshToken);

router.route("/account/force/reset").post(controller.forceUpdate);



module.exports = router;
