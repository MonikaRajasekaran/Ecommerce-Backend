const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);

const schema = new Schema(
  {
    categoriesId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
   
    categoryImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Task model
schema.index({ categoriesId: 1 });

module.exports = mongoose.model("Categories", schema);
