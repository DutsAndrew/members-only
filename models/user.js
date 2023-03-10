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
  role: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
});

module.exports = mongoose.model("User", UserSchema);