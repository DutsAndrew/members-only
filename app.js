const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      indexRouter = require('./routes/index'),
      appRouter = require('./routes/app'),
      mongoose = require('mongoose'),
      bcrypt = require('bcryptjs');
      app = express();

require("dotenv").config();

// database link in
mongoose.set('strictQuery', false);
const mongoDB = process.env.devDB;
(async function main() {
  try {
    await mongoose.connect(mongoDB);
  } catch(err) {
    console.error(err);
  };
})();

// // // // // // // // // // // // //

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/app', appRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;