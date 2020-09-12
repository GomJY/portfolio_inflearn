const express = require('express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
require('dotenv').config();

const port = 5901;

const passportConfig = require('./passport'); 

const routingGroup = new Object();
routingGroup.index = require('./routes/index');
routingGroup.auth = require('./routes/auth');
routingGroup.upload = require('./routes/upload');
routingGroup.question = require('./routes/question');
routingGroup.lecture = require('./routes/lecture');

const app = express();
passportConfig(passport);

// view engine setup & port setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', port || 3000);

//dev middle ware settings
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

//2.routing_middleware use
app.use('/', routingGroup.index);
app.use('/auth', routingGroup.auth);
app.use('/upload', routingGroup.upload);
app.use('/question', routingGroup.question);
app.use('/lecture', routingGroup.lecture);


app.use((req, res, next) => {
  console.log("NotFound1");
  const err = new Error('!!!Not Found');
  err.status = 404;
  // next(err);
  res.render('notfound');
});

// error handler
app.use((err, req, res) => {
  console.log("ErrorFind");
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.render('notfound');
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} 번 포트에서 서버가 시작 되었습니다.`);
});
