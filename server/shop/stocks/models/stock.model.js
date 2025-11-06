const mongoose = require("mongoose");
const shortid = require("shortid");
const Float = require("../../../helpers/float").loadType(mongoose, 2);

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    stockId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    productId: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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

schema.index({ stockId: 1 });
schema.index({ productId: 1 });
schema.index({ productId: 1, status: 1 });

module.exports = mongoose.model("stock", schema);
