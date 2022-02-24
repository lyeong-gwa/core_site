//pm2,cross-env grobal
const express = require('express');
const asyncify = require('express-asyncify');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const multer =require('multer');
dotenv.config();
const coreRouter = require('./routes/core');
const userRouter = require('./routes/user');
const robotRouter = require('./routes/robot');
const ajaxRouter = require('./routes/ajax');
let rateLimit = require("express-rate-limit");
const app = asyncify(express());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('port', process.env.PORT || 8001);
app.use('/upload', express.static('upload'));
app.use('/maple_python', express.static('maple_python'));
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(rateLimit({ 
  windowMs: 1*60*1000, 
  max: 30
  })
);
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: true,
  },
  name: 'session-cookie',
}));

app.use('/', coreRouter);
app.use('/user', userRouter);
app.use('/robots.txt', robotRouter);
app.use('/ajax', ajaxRouter);
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

module.exports=app;