const env = process.env.NODE_ENV || 'development';

console.log(env);

// process.env.MONGODB_URI = 'mongodb+srv://admin:test1234@cluster0.8uldc.gcp.mongodb.net/Cluster0?retryWrites=true&w=majority';

process.env.MONGODB_URI = 'mongodb://admin:test1234@cluster0-shard-00-00.8uldc.gcp.mongodb.net:27017,cluster0-shard-00-01.8uldc.gcp.mongodb.net:27017,cluster0-shard-00-02.8uldc.gcp.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-7gmb8j-shard-0&authSource=admin&retryWrites=true&w=majority';

// process.env.MONGODB_URI = 'mongodb://localhost:27017/rtgs';


const history = require('connect-history-api-fallback');
const bodyParser=require('body-parser');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');

const { mongoose } = require('./db/mongoose');

let app = express();

// view engine setup

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// SPA Handling
app.use(express.static(path.join(__dirname, 'public')));
app.use(history());
app.use(bodyParser.json());
app.use(cors());

// Invoking initial chaincode
const initial = require('./invoke/initial.js');

initial.enrollCentralBank().then(res => {
    console.log(res.message);
}).catch(err => {
    console.log(err);
});

initial.enrollBank001().then(res => {
    console.log(res.message);
}).catch(err => {
    console.log(err);
});

initial.enrollBank002().then(res => {
    console.log(res.message);
}).catch(err => {
    console.log(err);
});


// Set up routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

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
  // res.render('error');
});

process.on('SIGINT', async function () {
    //todo shift from console.error to something more...reasonable
    console.error('SIGINT called');
    await mongoose.disconnect();
    console.error('Mongoose connection terminated');
    process.exit(0);
});

process.on('SIGTERM', async function () {
    console.error('SIGTERM called');
    await mongoose.disconnect();
    console.error('Mongoose connection terminated');
    process.exit(0);
});


module.exports = app;
