const mongoose = require("mongoose");

const { Schema } = mongoose;
const shortid = require("shortid");

const configSchema = new Schema(
  {
    configId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    region: {
      type: String,
      default: "IN",
    },
    applicationFee: {
      amount: {
        type: Number,
        required: true,
      },
      metric: {
        type: String,
        default: "PERCENTAGE",
        enum: ["PERCENTAGE", "FIXED"],
      },
    },
    serviceFee: {
      amount: {
        type: Number,
        required: true,
      },
      metric: {
        type: String,
        default: "PERCENTAGE",
        enum: ["PERCENTAGE", "FIXED"],
      },
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
  },
  {
    timestamps: true,
  }
);

configSchema.index({ configId: 1 });
configSchema.index({ region: 1 });

module.exports = mongoose.model("Config", configSchema);
