const accessCtrl = require("accessctrl");

const list = accessCtrl.generateACL({
  source: "server/**/*.routes.js", //location of the routes/controller
});
