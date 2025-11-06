const mongoose = require("mongoose");
const shortid = require("shortid");
const Float = require("../../../helpers/float").loadType(mongoose, 2);

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    stockEntryId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ stockEntryId: 1 });

module.exports = mongoose.model("stockEntry", schema);
