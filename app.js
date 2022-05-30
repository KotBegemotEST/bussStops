var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db_funcs = require("./db/db_func.js")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next)=>{
  let data = db_funcs.readStops()
  // res.send(data)
  console.log(db_funcs.getRegions(data));
  res.render("index")

  

  // db_funcs.readStops();
})
app.use('/users', usersRouter)
app.get("/test",(req, res, next)=>{

  res.json({test:"test"})
})


app.get('/javascripts/main.js',function(req,res){
  res.sendFile(path.join(__dirname + '/javascripts/main.js')); 
});



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




// app.post('/', urlencodedParser, function (req, res) {
//   raceId = req.body.place + "_" + Date.now()
//   console.log('test')
//   res.redirect('/')
// })
module.exports = app;

