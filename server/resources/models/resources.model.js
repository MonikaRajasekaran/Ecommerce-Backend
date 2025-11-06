const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    resourceId: {
      type: String,
      default: shortid.generate,
      unique: true,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    file: {
      ETag: {
        type: String,
      },
      ServerSideEncryption: {
        type: String,
      },
      VersionId: {
        type: String,
      },
      Location: {
        type: String,
        required: true,
      },
      key: {
        type: String,
        required: true,
      },
      Key: {
        type: String,
        required: true,
      },
      Bucket: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ "file.key": 1 });
resourceSchema.index({ resourceId: 1 });
resourceSchema.index({ createdBy: 1 });
resourceSchema.index({ category: 1 });

module.exports = mongoose.model("Resources", resourceSchema);
