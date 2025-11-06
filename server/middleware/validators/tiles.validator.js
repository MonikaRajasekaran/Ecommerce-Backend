const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "createTiles": {
      return [
        check("name")
          .exists()
          .trim()
          .escape()
          .withMessage("Tile name should not be empty"),
      ];
    }
    case "deleteTile": {
      return [
        check("tileId")
          .exists()
          .trim()
          .escape()
          .withMessage("tileId should not be empty"),
      ];
    }
    default:
      return [];
  }
};
