var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const db_funcs = require("./db/db_func.js")

dotenv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
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


app.get('/getAllStops/:stop_area',async (request, response) => {
  const stop_area= request.params.stop_area;
  const result = await db_funcs.getAllStops(stop_area);
  response.send(result)

})


app.get('/getBuses/:stop_area/:stop_name',async (request, response) => {
  const stop_area= request.params.stop_area;
  const stop_name= request.params.stop_name;
  console.log("Region: ", stop_area,"Stop name: ", stop_name)
  
  const result = await db_funcs.getBuses(stop_area,stop_name);
  response.send(result)
})


app.get('/getReg/:lat/:lon',async (request, response) => {
  const lat = parseFloat(request.params.lat);
  const lon = parseFloat(request.params.lon);
  const result = await db_funcs.getReg(lat,lon);
  response.send(result)
})

app.get('/getNearestStops/:lat/:lon',async (request, response) => {
  const lat = parseFloat(request.params.lat);
  const lon = parseFloat(request.params.lon); 
  const result = await db_funcs.getNearestStops(lat,lon);
  response.send(result)
})

app.get('/getStopTimes/:stop_area/:stop_name/:route_short_name/:dep_time', async (request, response) => {
  const stop_area= request.params.stop_area;
  const stop_name= request.params.stop_name;
  const route_short_name= request.params.route_short_name;
  const dep_time = request.params.dep_time;
  console.log(stop_area, stop_name, route_short_name,dep_time);
  let result = await db_funcs.getTimes(stop_area, stop_name, route_short_name, dep_time);
  console.log("/getStopTimes/:stop_area/:stop_name/:route_short_name/:dep_time")
  console.log(result.length)
  if(result.length < 5 ){
    console.log("меньше 5")
    result2 = await db_funcs.getTimesLess(stop_area, stop_name, route_short_name, dep_time);
    console.log("-------result---------")
    console.log(result)
    console.log("-------result2---------")
    console.log(result2)
    console.log("-------result3---------")
    console.log(result.concat(result2))
    
  }
  // console.log(result);
  response.send(result.concat(result2))
})


module.exports = app;

