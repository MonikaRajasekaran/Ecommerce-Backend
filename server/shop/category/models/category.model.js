const mongoose = require("mongoose");
const shortid = require("shortid");
const Float = require("../../../helpers/float").loadType(mongoose, 2);

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    categoryId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    name: {
      type: String,
      required: true,
    },
    alias: {
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

schema.index({ categoryId: 1 });

module.exports = mongoose.model("category", schema);
