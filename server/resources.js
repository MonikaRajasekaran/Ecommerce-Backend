const express = require("express");

const router = express.Router();
const repository = require("./repository/routes/repository.routes");

router.use("/", repository);


module.exports = router;
