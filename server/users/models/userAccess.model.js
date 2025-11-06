// Example model

const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const Session = new Schema(
  {
    sessionId: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    deviceInfo: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const userAccessSchema = new Schema(
  {
    accessId: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    sessions: {
      type: [Session],
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userAccessSchema.index({ userId: 1 });

userAccessSchema.index({ regionId: 1, userId: 1 });

module.exports = mongoose.model("UserAccess", userAccessSchema);
