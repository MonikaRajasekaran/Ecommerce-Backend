const express = require("express");
const regionController = require("../controllers/regions.controller");
const region = require("../../middleware/validators/region.validator");
const error = require("../../middleware/validators/error.validator");

const router = express.Router();

router
  .route("/")
  .post(
    region.validate("CreateRegion"),
    error.check(),
    regionController.createRegion
  );

router
  .route("/:regionId")
  .patch(
    region.validate("UpdateRegion"),
    error.check(),
    regionController.updateRegionDetails
  );

router
  .route("/:regionId/offers")
  .patch(
    region.validate("UpdateOffers"),
    error.check(),
    regionController.updateOfferDetails
  );

router
  .route("/:regionId/contact/:contactId")
  .delete(regionController.deleteContact);

router
  .route("/:regionId/pfm/:pfmCategoryId")
  .delete(regionController.deletePfmData);
module.exports = router;
