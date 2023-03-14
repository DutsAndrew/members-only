const { DateTime } = require('luxon');

exports.get_create_message = (req, res, next) => {
  res.render('message-create', {
    title: 'Create a Message',
  });
};

exports.post_create_message = (req, res, next) => {
  // create timestamp for message save to db
  
};