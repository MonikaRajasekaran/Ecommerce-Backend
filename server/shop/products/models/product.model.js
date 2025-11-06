const mongoose = require("mongoose");
const shortid = require("shortid");
const Float = require("../../../helpers/float").loadType(mongoose, 2);

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    name: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    pdtSpec: {
      type: String,
    },
    brand: {
      type: String,
    },
    amount: {
      type: Float,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"]
    }
  },
  {
    timestamps: true,
  }
);

schema.index({ productId: 1 });

module.exports = mongoose.model("product", schema);
