// Example model

const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address:{
      type: String,
    },
    razorpayCustomerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ profileId: 1 });

module.exports = mongoose.model("Profile", schema);
