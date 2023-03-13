const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  username: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 15,
  },
  email: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  role: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
});

UserSchema.virtual("id").get(function () {
  return `/app/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);