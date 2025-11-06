const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    subscriptionId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    key: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      }
    },
    type: {
      type: String,
      required: true,
      enum: ["TRIAL", "SUBSCRIBED", "FREE"],
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "CANCELED", "EXPIRED"],
    }
  },
  {
    timestamps: true,
  }
);

schema.index({ staffId: 1 });

module.exports = mongoose.model("subscription", schema);
