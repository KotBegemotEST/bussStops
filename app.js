var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db_funcs = require("./db/db_func.js")



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res, next)=>{
  res.render("index")
})

app.get('/getAllRegions', async  (req, res, next)=>{
  console.log("гет запрос пришел")
  let result = await  db_funcs.getRegions()
  console.log("гет запрос пришел2")

  res.send(result)

})

// app.post('/sendRegion', (req, res, next)=>{
//   console.log("sendRegion пришел")
//   // console.log(JSON.parse(req))
//   console.log(JSON.parse(req.body));
// })


app.get('/getAllStops/:stop_area', (request, response) => {

  console.log("sendRegion пришел")
  console.log(req.body);

  // const stop_area= request.params.stop_area;
  // const db = dbService.getDbServiceInstance();
  
  // const result = db.getAllStops(stop_area);

  result
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));
})

module.exports = app;

