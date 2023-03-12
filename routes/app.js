const express = require('express'),
      router = express.Router(),
      appController = require('../controllers/appController'),
      messageController = require('../controllers/messageController'),
      userController = require('../controllers/userController');

router.get('/', appController.index);
router.get('/sign-up', userController.sign_up);

module.exports = router;