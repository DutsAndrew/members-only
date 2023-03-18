const async = require('async'),
      Message = require('../models/message'),
      he = require('he'),
      { DateTime } = require('luxon');

exports.index = async (req, res, next) => {
  try {
    const messages = await Message.find().populate("author");

    // remove escaped characters like ' or " used in sentences.
    messages.forEach((message) => {
      he.decode(message.title);
      he.decode(message.body);
    });

    // sort to most recent
    messages.sort((a, b) => {
      return DateTime.fromISO(b.timestamp).diff(DateTime.fromISO(a.timestamp)).as('milliseconds');
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