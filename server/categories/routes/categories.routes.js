const express = require("express");

const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

router.route("/").get(categoriesController.getCategory);

router.route("/").post(categoriesController.createCategory);


router.route("/:categoriesId").get(categoriesController.getCategoryById);

router.route("/:categoriesId").patch(categoriesController.patchCategory);

router.route("/:categoriesId").delete(categoriesController.deleteCategory);

module.exports = router;
