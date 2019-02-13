const Channel_Type = {
  public : 0,
  private : 1,
  direct : 2
};

const http = require("http");
const express = require("express");
const request = require('request');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const utils = require('./utils');
const config = require('./config/config.json');

const app = express();

// just by security, hide the fact that we use express
app.disable("x-powered-by");

// to log every request for debugging
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: 'a' });
app.use(morgan("combined", { stream: accessLogStream }));

// to accept JSON and form urlencoded data from client
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

// define routes
app.use('/api/auth', require('./routes/auth'));
app.use("/api/user", require("./routes/user"));

// 404
app.use((req, res, next) => {
  res.status(404);
  res.json({ success: false, message: "Not found!" });
});

const server = http.createServer(app).listen(config.port, () => {
  console.log(`HTTP server started successfully on port ${config.port}!`);
});

/* socket.io chat */

const io = require('socket.io')(server);

io.on('connection', require('./socket.io/connection'));
