const { DateTime } = require('luxon'),
      { body, validationResult } = require('express-validator'),
      message = require('../models/message');

exports.get_create_message = (req, res, next) => {
  res.render('message-create', {
    title: 'Create a Message',
  });
};

exports.post_create_message = [
  body("title", "Your message must have a title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Your title must fit the parameters of at least one character and no more than 50 characters")
    .escape(),
  body("body", "Your message must have body text")
    .trim()
    .isLength({ min: 1, max: 10000})
    .withMessage("Your body text must fit our parameters of at least one character and no more than 10000 characters")
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message-create", {
        title: 'Create a Message',
        messageTitle: req.body.title,
        messageBody: req.body.body,
        errors: errors.array(),
      });
    } else {
      const newMessage = new message({
        author: req.body.author,
        body: req.body.body,
        timestamp: DateTime.now(),
        title: req.body.title,
      });
      try {
        const uploadMessage = await newMessage.save();
        res.redirect('/app');
      } catch(err) {
        next(err);
      };
    };
  },
];