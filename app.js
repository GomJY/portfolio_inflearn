const express = require('express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');


const port = 5901;

//1.routing_middleware require
// const routingGroup =  {
//   index : require('./routes/index'),
//   user  :require('./routes/users'),
// }

const routingGroup = new Object();
routingGroup.index = require('./routes/index');
routingGroup.user = require('./routes/users');

const app = express();

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

//2.routing_middleware use
app.use('/', routingGroup.index);
app.use('/user', routingGroup.user);

app.use((req, res, next) => {
  const err = new Error('!!!Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} 번 포트에서 서버가 시작 되었습니다.`);
});
