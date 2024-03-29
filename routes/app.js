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

router.get('/log-out', userController.get_log_out);

router.post('/member-validation/:id', userController.post_become_member);

router.get('/create-message/', messageController.get_create_message);
router.post('/create-message/', messageController.post_create_message);

router.get('/delete-message/:id', messageController.get_delete_message);
router.post('/delete-message/:id', messageController.post_delete_message);

router.get('/edit-message/:id', messageController.get_edit_message);
router.post('/edit-message/:id', messageController.post_edit_message);

module.exports = router;