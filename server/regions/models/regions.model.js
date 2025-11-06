const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const Currency = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
  },
  { _id: false }
);

const regionSchema = new Schema(
  {
    regionId: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isoAlpha2: {
      type: String,
      required: true,
    },
    isoAlpha3: {
      type: String,
      required: true,
    },
    phoneCode: {
      type: String,
      required: true,
    },
    isoNumeric: {
      type: Number,
    },
    flag: {
      type: String,
    },
    currency: {
      type: Currency,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    timezone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

regionSchema.index({ regionId: 1 });
regionSchema.index({ isoAlpha3: 1 }, { unique: true });

module.exports = mongoose.model("Region", regionSchema);
