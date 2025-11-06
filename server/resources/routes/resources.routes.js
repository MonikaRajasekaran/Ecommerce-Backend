const express = require("express");

const multipart = require("connect-multiparty");

const router = express.Router();
const resControl = require("../controllers/resource.controller");
const resource = require("../../middleware/validators/resource.validator");
const error = require("../../middleware/validators/error.validator");
const antivirus = require("../../middleware/antivirus.middleware");

const upload = require("../../middleware/multer.disk.middleware");

router
  .route("/")
  .post(
    upload.single("file"),
    resource.validate("createResource"),
    error.check(),
    antivirus.viruscheck(),
    resControl.uploadFile
  );


module.exports = router;
