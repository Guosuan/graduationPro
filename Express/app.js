var cors = require('cors');
var bodyParser = require('body-parser');


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/api/signup');
var signinRouter = require('./routes/api/signin');
var showprojectRouter = require('./routes/api/showproject');
var prodetailRouter = require('./routes/api/prodetail');
var searchproRouter = require('./routes/api/searchpro');
var releaseproRouter = require('./routes/api/releasepro');
var takeproRouter = require('./routes/api/takepro');
var evaproRouter = require('./routes/api/evapro');
var showevaRouter = require('./routes/api/showeva');
var uploadresumeRouter = require('./routes/api/uploadresume');
var uploadproRouter = require('./routes/api/uploadpro');
var downproRouter = require('./routes/api/downpro');
var canRouter = require('./routes/api/can');
var positionRouter = require('./routes/api/position');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin:['http://localhost:8080'],
  methods:['Get','Post'],
}))

 app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By","3.2.1");
  if(req.method=="PTIONS") res.send(200);
  else next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup',signupRouter);
app.use('/signin',signinRouter);
app.use('/showproject',showprojectRouter);
app.use('/prodetail',prodetailRouter);
app.use('/searchpro',searchproRouter);
app.use('/releasepro',releaseproRouter);
app.use('/takepro',takeproRouter);
app.use('/evapro',evaproRouter);
app.use('/showeva',showevaRouter);
app.use('/uploadpro',uploadproRouter);
app.use('/uploadresume',uploadresumeRouter);
app.use('/downpro',downproRouter);
app.use('/can',canRouter);
app.use('/position',positionRouter);

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
