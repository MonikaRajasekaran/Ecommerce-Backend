const path = require("path");
const multer = require("multer");
const Constants = require("../helpers/Constants");

const upload = multer({
  dest: "temp/",
  limits: { fileSize: Constants.UPLOAD_MAX_FILESIZE },
  fileFilter: function filter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(
      `Error: File upload only supports the following filetypes - ${filetypes}`
    );
  },
});

module.exports = upload;
