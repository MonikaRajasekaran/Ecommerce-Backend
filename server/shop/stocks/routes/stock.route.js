/* Third party npm */
const express = require('express');

const router = express.Router();

/* Internal modules */
const controller = require('../controllers/stock.controller');

router.route('/').get(controller.get);

router.route('/:productId').get(controller.getById);

router.route('/:productId').patch(controller.patch);

router.route('/:productId').delete(controller.delete);

module.exports = router;
