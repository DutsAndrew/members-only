const { DateTime } = require('luxon'),
      { body, validationResult } = require('express-validator'),
      Message = require('../models/message');

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
      const newMessage = new Message({
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

exports.get_delete_message = async (req, res, next) => {
  const messageToDelete = await Message.findById(req.params.id);
  res.render("message-delete", {
    title: "Delete this Message",
    message: messageToDelete,
  });
};

exports.post_delete_message = async(req, res, next) => {
  try {
    const deleteMessage = await Message.findByIdAndRemove(req.params.id);
    res.redirect('/app');
  } catch(err) {
    return next(err);
  };
};

exports.get_edit_message = async (req, res, next) => {
  try {
    const retrieveMessage = await Message.findById(req.params.id);
    res.render("message-edit", {
      title: "Edit Message",
      message: retrieveMessage,
    });
  } catch(err) {
    return next(err);
  };
};

exports.post_edit_message = [
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
      res.render("message-edit", {
        title: 'Edit Message',
        messageTitle: req.body.title,
        messageBody: req.body.body,
        errors: errors.array(),
      });
    } else {
      const editedMessage = new Message({
        author: req.body.author,
        body: req.body.body,
        timestamp: DateTime.now(),
        title: req.body.title,
        _id: req.params.id,
      });
      try {
        const uploadMessage = await Message.findByIdAndUpdate(req.params.id, editedMessage);
        res.redirect('/app');
      } catch(err) {
        next(err);
      };
    };
  },
];