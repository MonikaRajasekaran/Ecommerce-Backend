/* Third party npm */
const express = require('express');

const router = express.Router();

/* Internal modules */
const controller = require('../controllers/category.controller');

router.route('/').get(controller.get);

router.route('/').post(controller.create);

router.route('/:categoryId').get(controller.getById);

router.route('/:categoryId').patch(controller.patch);

router.route('/:categoryId').delete(controller.delete);

router.route('/detail/product').get(controller.getDetailedProduct);

module.exports = router;
