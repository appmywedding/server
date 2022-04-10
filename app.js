const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');


// TODO: if users is firstly created then create the collections along with it.
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const invitesRouter = require('./routes/invites');
const usersItemsRouter = require('./routes/usersItems');
const fileRouter = require('./routes/files');
const itemsRouter = require('./routes/items');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/invites', invitesRouter);
app.use('/user/items', usersItemsRouter);
app.use('/user', usersRouter);
app.use('/files', fileRouter);
app.use('/items', itemsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// TODO: Make sure to authenticate the user

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err.stack)
  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.error);
});

module.exports = app;
