const express = require('express'),
      router = express.Router(),
      appController = require('../controllers/appController'),
      messageController = require('../controllers/messageController'),
      userController = require('../controllers/userController');

router.get('/', appController.index);

router.get('/sign-up', userController.get_sign_up);
router.post('/sign-up', userController.post_sign_up);

router.get('/log-in', userController.get_log_in);
router.post('/log-in', userController.post_log_in);

router.get('/log-out');

module.exports = router;