const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const config = require("./config");
const decrypter = require("../server/helpers/decrypter.helper");

const connection = async () => {
  let connectionString = `mongodb${
    config.extras.srv == "true" ? "+srv" : ""
  }://`;
  if (config.extras.db_username && config.extras.db_password) {
    connectionString += `${await decrypter.decrypt(
      config.extras.db_username
    )}:${await decrypter.decrypt(config.extras.db_password)}@`;
  }
  connectionString += `${config.extras.db_host}/${config.extras.db_name}`;
console.log(connectionString);
  mongoose.connect(connectionString);

  mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database`);
  });
  return mongoose;
};
module.exports = { connection, mongoose };
