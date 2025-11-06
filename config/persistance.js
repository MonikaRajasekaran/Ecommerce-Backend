const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const config = require("./config");
const decrypter = require("../server/helpers/decrypter.helper");

const connection = async () => {
  try {
    let connectionString = `mongodb${config.extras.srv === "true" ? "+srv" : ""}://`;

    let username = config.extras.db_username;
    let password = config.extras.db_password;

    try {
      if (username) username = await decrypter.decrypt(username);
      if (password) password = await decrypter.decrypt(password);
    } catch (err) {
      console.warn("⚠️ Using plain DB credentials (decryption skipped)");
    }

    if (username && password) {
      connectionString += `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
    }

    connectionString += `${config.extras.db_host}/${config.extras.db_name}?retryWrites=true&w=majority`;

    console.log("🟢 MongoDB URI:", connectionString.replace(/:[^:@]+@/, ":****@"));

    await mongoose.connect(connectionString);
    console.log("✅ Database connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    return mongoose;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};

module.exports = { connection, mongoose };
