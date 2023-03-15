require('dotenv').config({ path: './env/.env' })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoute');
var panelRouter = require('./routes/panel');
var equiposRouter = require('./routes/equiposRouter');
var otRouter = require('./routes/otRouter');
var reportes = require('./routes/reportesRouter');
var kks = require('./routes/kksRouter');
const cron = require("node-cron");
const { cancelarotd } = require('./controllers/otController');
var app = express();
const Ot = require('./models/Ot');
//Nos conectamos a la base de datos
require('./database/db');
require('./database/asociations');

console.log("Servidor corriendo en:"+process.env.GUDDY)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/equipos', equiposRouter);
app.use('/ot', otRouter);
app.use('/panel', panelRouter);
app.use('/kks', kks);
app.use('/reportes', reportes);

//Para eliminar la cache 

app.use(function(req, res, next) { res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); next(); });
  

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
// cron.schedule("0 0 0 * * *", function () {
cron.schedule("0 */20 * * *", function () {
 
  // croncancelarotd();
  
});
const croncancelarotd=async(req,res,next)=>{
  console.log("---------------------");
  console.log("running a task every 12 hours");
  try {
      await Ot.update({ estasupervisor: 2},{ where: { estadotecnico: 0,estasupervisor:0 } })
  } catch (error) {
      console.log("Error al ejecutar CRON JOBS:"+error);
  }
}
// app.use(function(req, res, next) {
//   const galletita = req.cookies.jwt
//   const userToken =  jwt.verify(galletita,process.env.SECRET_JWT_SEED);
//   req.user=userToken;
//   res.locals.user ="Guddy";
//   console.log("666"+res.locals.user);
//   next();
// });
module.exports = app;
