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

app.get('/', (req, res)=>{
  res.render("index")
})

app.get('/getAllRegions', async  (req, res)=>{
  console.log("/getAllRegions")
  let result = await db_funcs.getRegions()
  console.log("гет запрос пришел2")
  res.send(result)
})

// app.post('/sendRegion', (req, res, next)=>{
//   console.log("sendRegion пришел")
//   // console.log(JSON.parse(req))
//   console.log(JSON.parse(req.body));
// })


app.get('/getAllStops/:stop_area',async (request, response) => {
  const stop_area= request.params.stop_area;
  const result = await db_funcs.getAllStops(stop_area);
  console.log("/getAllStops/:stop_area")
  console.log(result);
  response.send(result)

})


app.get('/getBuses/:stop_area/:stop_name',async (request, response) => {
  const stop_area= request.params.stop_area;
  const stop_name= request.params.stop_name;
  console.log("Region: ", stop_area,"Stop name: ", stop_name)
  
  const result = await db_funcs.getBuses(stop_area,stop_name);
  console.log("/getBuses/:stop_area/:stop_name")
  console.log(result);
  response.send(result)
  // result
  // .then(data => response.json({data : data}))
  // .catch(err => console.log(err));
})


app.get('/getReg/:lat/:lon',async (request, response) => {
  const lat = parseFloat(request.params.lat);
  const lon = parseFloat(request.params.lon);
  const result = await db_funcs.getReg(lat,lon);
  console.log("/getReg/:lat/:lon")
  console.log(result);
  response.send(result)
})

app.get('/getNearestStops/:lat/:lon',async (request, response) => {
  const lat = parseFloat(request.params.lat);
  const lon = parseFloat(request.params.lon);
  
  const result = await db_funcs.getNearestStops(lat,lon);

  console.log("/getNearestStops/:lat/:lon")
  console.log(result);
  response.send(result)
})

app.get('/getStopTimes/:stop_area/:stop_name/:route_short_name/:dep_time', async (request, response) => {
  const stop_area= request.params.stop_area;
  const stop_name= request.params.stop_name;
  const route_short_name= request.params.route_short_name;
  const dep_time = request.params.dep_time;
  console.log(stop_area, stop_name, route_short_name,dep_time);
  const result = await db_funcs.getTimes(stop_area, stop_name, route_short_name, dep_time);
  console.log("/getStopTimes/:stop_area/:stop_name/:route_short_name/:dep_time")
  console.log(result);
  response.send(result)
})


module.exports = app;

