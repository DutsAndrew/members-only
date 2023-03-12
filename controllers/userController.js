const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.sign_up = (req, res, next) => {
  res.render("account-create", {
    title: "Create Your Account:"
  });
};