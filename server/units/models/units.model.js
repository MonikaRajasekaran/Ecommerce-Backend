const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);

const unitSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
  }
});

const schema = new Schema(
  {
    categoryId: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    unitId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    units: [unitSchema],
    variants: {
      type: Map,
      of: [String],
      default: {}
    },
    createdBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    orgId: { type: String },
  },
  {
    timestamps: true,
  }
);

// Export the Task model
schema.index({ unitId: 1 });

module.exports = mongoose.model("Units", schema);
