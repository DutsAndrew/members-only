const { body, validationResult } = require('express-validator'),
      User = require('../models/user'),
      bcrypt = require('bcryptjs'),
      passport = require('passport'),
      async = require('async');

exports.get_sign_up = (req, res, next) => {
  res.render("account-create", {
    title: "Create Your Account:",
  });
};

exports.post_sign_up = [
  body("firstName", "First name is required")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("First names must fit our criteria of at least 1 character and no more than 1000 characters.")
    .escape(),
  body("lastName", "Last name is required")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("First names must fit our criteria of at least 1 character and no more than 1000 characters.")
    .escape(),
  body("username", "A username is required")
    .trim()
    .isAlpha()
    .withMessage('Your username must be in alphabetical characters')
    .isLength({ min: 1, max: 20 })
    .withMessage("Usernames must fit our 20 character limit")
    .escape(),
  body("email", "Emails are required")
    .trim()
    .normalizeEmail()
    .isEmail()
    .isLength({ min: 1, max: 100 })
    .withMessage("Your email must fit our constraints of at least 1 character and no more than 100 characters.")
    .escape(),
  body("password", "Passwords are required")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Your password must fit our constraints of at least one character and no more than 1000 characters.")
    .escape(),
  body("confirmPassword", "Passwords confirmations are required")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Your password confirmation must fit our constraints of at least one character and no more than 1000 characters.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password confirmation does not match password')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("account-create", {
        title: "Create Your Account:",
        user: new User({
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          username: req.body.username,
        }),
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashedPassword,
          username: req.body.username,
          role: 'basic',
        });
        try {
          const result = await user.save();
          res.redirect('/app');
        } catch(err) {
          return next(err);
        };
      });
    };
  },
];

exports.get_log_in = (req, res, next) => {
  res.render("account-log-in", {
    title: "Log In:"
  });
};

exports.post_log_in = [
  body("username", "You forgot to enter your username")
    .trim()
    .isLength({ min: 1, max: 20})
    .withMessage("Usernames must fit our 20 character limit")
    .escape(),
  body("password", "You forgot to enter your password")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Your password must fit our constraints of at least one character and no more than 1000 characters.")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("account-log-in", {
        title: "Log In:",
        credentials: {
          username: req.body.username,
          password: req.body.password,
        },
      });
    } else {
     next();
    };
  },

  passport.authenticate("local", {
    successRedirect: "/app",
    failureRedirect: "/app/log-in",
  }),
];

exports.get_log_out = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/app');
  });
};

exports.post_become_member = [
  body("memberPassword", "You must enter your member password to verify membership")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("index", {
        title: "Members Only Chat",
        welcome: "Check out the latest messages:",
        userMessage: "Welcome back, ",
        user: currentUser,
      });
    } else {
      if (req.body.memberPassword === process.env.memberAuth) {
        // membership password was correct
        try {
          const user = await User.findById(req.params.id);
          const updatedUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            password: user.password,
            role: "member",
            _id: user.id,
          });
          const uploadUser = await User.findByIdAndUpdate(req.params.id, updatedUser);
          res.redirect('/app');
        } catch(err){
          return next(err);
        };
      } else {
        // member password was incorrect
        res.render("index", {
          title: "Members Only Chat",
          welcome: "Check out the latest messages:",
          userMessage: "Welcome back, ",
          user: currentUser,
        });
      };
    };
  },
];