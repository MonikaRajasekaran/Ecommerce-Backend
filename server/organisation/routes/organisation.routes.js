/* Third party npm */
const express = require('express');

const router = express.Router();

/* Internal modules */
const controller = require('../controllers/organisation.controller');

router.route('/').get(controller.get);

router.route('/mine').get(controller.getMine);

router.route('/').post(controller.create);

// router.route('/').patch(controller.patch);

// router.route('/').delete(controller.delete);

module.exports = router;
