var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profiles');

var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');
var tagsRouter = require('./routes/tags');

const { default: mongoose } = require('mongoose');

var app = express();

// connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/community-forum-api-jwt')
  .then(() => console.log('Connected to DB!'))
  .catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express API Server routes all incoming requests to /api/xyz routes.
app.use('/api', indexRouter);
app.use('/api/users', usersRouter); // routes for register, login and view current user
app.use('/api/profile', profileRouter); // routes for profile
app.use('/api/questions', questionsRouter); // routes for community forum questions
app.use('/api/answers', answersRouter); // routes handled for community forum question's answers
app.use('/api/tags', tagsRouter); // to handle all routes for a question's tag updates

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
