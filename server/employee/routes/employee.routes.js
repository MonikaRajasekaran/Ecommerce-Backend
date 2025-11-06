const express = require("express");

const router = express.Router();
const employeeController = require("../controllers/employee.controller");

router.route("/").get(employeeController.getEmployee);
router.route("/search").get(employeeController.searchEmployee);

router.route("/").post(employeeController.createEmployee);

router.route("/:employeeId").get(employeeController.getEmployeeById);

router.route("/:employeeId").patch(employeeController.patchEmployee);

router.route("/:employeeId").delete(employeeController.deleteEmployee);

module.exports = router;
