const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  timestamp: {
    type: String,
    required: true,
    minLength: 1,
  },
  body: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 10000,
  },
  author: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
  ],
});

module.exports = mongoose.model("Message", messageSchema);