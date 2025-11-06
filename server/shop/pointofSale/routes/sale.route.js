/* Third party npm */
const express = require('express');

const router = express.Router();

/* Internal modules */
const controller = require('../controllers/sale.controller');

router.route('/').get(controller.get);

router.route('/sale').post(controller.create);

router.route('/:saleId').get(controller.getById);

router.route('/:saleId').patch(controller.patch);

router.route('/:saleId').delete(controller.delete);

module.exports = router;
