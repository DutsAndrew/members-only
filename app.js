const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      indexRouter = require('./routes/index'),
      appRouter = require('./routes/app'),
      User = require('./models/user');
      mongoose = require('mongoose'),
      bcrypt = require('bcryptjs');
      session = require('express-session'),
      LocalStrategy = require('passport-local'),
      passport = require('passport');
      app = express();

require("dotenv").config();

// database link in
mongoose.set('strictQuery', false);
const mongoDB = process.env.devDB;
(async function main() {
  try {
    await mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, "mongo connection error"));
  } catch(err) {
    console.error(err);
  };
})();

// // // // // // // // // // // // //

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: true}));

passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return next(err);
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return next(err);
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password"});
        }
      });
    } catch(error) {
      // no user was found
      return done(error);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  // provides user in locals variable for all views
  res.locals.currentUser = req.user;
  next();
});

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