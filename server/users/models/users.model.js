// Example model

const mongoose = require("mongoose");
const shortid = require("shortid");
const crypto = require("crypto");

const authSupport = require("../../middleware/auth.middleware");

const roles = authSupport.roleManager;
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    isPBKDF2: {
      type: Boolean,
      default: true,
    },
    role: {
      type: [String],
      required: true,
      enum: ["USER", "VISITORS", "DOCTORS", "ADMIN", "ROOT"],
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    passwordLastReset: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ userId: 1 });

userSchema.index({ regionId: 1, userId: 1 });

userSchema.index(
  { username: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

function setPassword(password) {
  this.tPassword = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}

function getPassword() {
  return this.tPassword;
}

function getProfile() {
  return {
    userId: this.userId,
    name: this.name,
    isActive: this.isActive,
    isVerified: this.isVerified,
    role: this.role,
    createdAt: this.createdAt,
    state: this.state,
  };
}

function getToken() {
  return {
    userId: this.userId,
    role: this.role,
  };
}

function validateHashedPassword(hashedPassword) {
  return hashedPassword.length;
}

userSchema.virtual("password").set(setPassword).get(getPassword);

userSchema.virtual("profile").get(getProfile);

userSchema.virtual("token").get(getToken);

userSchema
  .path("hashedPassword")
  .validate(validateHashedPassword, "Password cannot be blank");

userSchema.methods = {
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt() {
    return crypto.randomBytes(16).toString("base64");
  },

  encryptPassword(password) {
    if (!password || !this.salt) {
      return "";
    }
    const salt = Buffer.from(this.salt, "base64");
    return crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("base64");
  },
};

userSchema.statics = {
  getRoot() {
    return this.findOne({
      role: roles.getMaxRole(),
    }).exec();
  },
};

module.exports = mongoose.model("Users", userSchema);
