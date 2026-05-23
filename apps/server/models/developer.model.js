const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateApiKey } = require('../utils/apiKey');

const developerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
      default: generateApiKey,
      select: false,
    },
  },
  { timestamps: true },
);

developerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

developerSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

developerSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    apiKey: this.apiKey,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Developer', developerSchema);
