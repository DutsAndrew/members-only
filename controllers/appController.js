const async = require('async'),
      Message = require('../models/message'),
      he = require('he');

exports.index = async (req, res, next) => {
  try {
    const messages = await Message.find();
    // remove escaped characters like ' or " used in sentences.
    messages.forEach((message) => {
      he.decode(message.title);
      he.decode(message.body);
    });
    res.render("index", {
      title: "Members Only Chat",
      welcome: "Check out the latest messages:",
      userMessage: "Welcome back, ",
      user: req.user,
      messages: messages,
    });
  } catch(err) {
    return next(err);
  };
};