const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);

const schema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    userId: { type: String },
    orgId: { type: String },
    orgRole: { type: String },
    dateOfJoining: { type: Date },
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

schema.index({ employeeId: 1 });

module.exports = mongoose.model("employee", schema);
