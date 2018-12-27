'use strict';

const http = require("http");
const express = require("express");
const request = require('request');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const db = require('./db'); // Connexion to database
const app = express();

// just by security :)
app.disable("x-powered-by");

// to log every request for debugging
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: 'a' })
app.use(morgan("combined", { stream: accessLogStream }))

// to accept JSON and form urlencoded data from client
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));

app.use((req, res, next) => {
  res.status(404);

  res.json({ success: false, message: "Not found!" });
});

const port = process.env.NODE_PORT || 3000;

http.createServer(app).listen(port, () => {
  console.log(`HTTP server started successfully on port ${port}!`);
});
