var express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/app');
});



module.exports = router;