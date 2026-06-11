const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const apiPrefixes = ['/movies', '/people', '/user'];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('cors')());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/movies', require('./routes/movie'));
app.use('/people', require('./routes/people'));
app.use('/user', require('./routes/users'));
app.use(require('./routes/swagger'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const wantsJson = apiPrefixes.some(prefix => req.path.startsWith(prefix)) ||
    req.accepts(['html', 'json']) === 'json';

  if (wantsJson) {
    return res.status(status).json({
      error: status >= 400,
      message: status === 500 ? 'Internal Server Error' : err.message
    });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(status);
  res.render('error');
});

module.exports = app;
