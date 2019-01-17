'use strict';

// Configuration
const port = 3000;
const trusted_ip = '192.168.1.13';

const Room_Type = {
  public : 0,
  private : 1,
  personal : 2,
  direct : 3
};

const http = require("http");
const express = require("express");
const request = require('request');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const db = require('./db'); // Connexion to database
const app = express();

// just by security :)
app.disable("x-powered-by");

// to log every request for debugging
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: 'a' })
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

const server = http.createServer(app).listen(port, () => {
  console.log(`Http server started successfully on port ${port}!`);
});

/* socket.io chat */

const io = require('socket.io')(server);

let users = [];
let rooms = [];

const identifyRoomType = (identifier) => {
	let room_type = Room_Type.public; // by default

	if (identifier.match(/^\#[a-z0-9-]{2,20}$/))
    room_type = Room_Type.public;
	else if (identifier.match(/^\#\([a-z0-9-]{2,20}\)$/))
    room_type = Room_Type.private;
  else if (identifier.match(/^\@[a-z0-9-]{2,20}$/))
    room_type = Room_Type.personal;
  else if (identifier.match(/^\$[a-z0-9-]{2,20}$/))
    room_type = Room_Type.direct;
	else throw "The room identifier doesn't correspond to a valid syntax!";

	return room_type;
}

io.on('connection', (client) => {
  const clientID = client.id;
  const token = client.handshake.query.token;
  console.log(`A client is connected! (${clientID})`);

  // decode the token
  const user = utils.decodeToken(token);

  console.log(user)

  if (user/* && client.request.connection.remoteAddress == trusted_ip*/) {
    console.log(`A client has been authorized from IP ${client.request.connection.remoteAddress}!`);

    if (!users[user.id])
      users[token] = user;
  }
  else {
    console.log(`A client has been rejected from IP ${client.request.connection.remoteAddress}!`);
  }

  client.on('disconnect', () =>	{
    console.log(`A client has been disconnected! (${clientID})`);
  });

  // A client wants to join a room
	client.on('join_room', (identifier) => {
    console.log(`A client asks to join ${identifier}`);

    const room_type = identifyRoomType(identifier);

    if (!rooms[identifier]) {
      rooms[identifier] = new Object();
      rooms[identifier].messages = [];
      rooms[identifier].creator_id = users[token].id;
      rooms[identifier].type = room_type;
      rooms[identifier].users_authorized = [];
      rooms[identifier].date_last_messages = 0;
      rooms[identifier].users_authorized[rooms[identifier].creator_id] = true;

      console.log(`The room ${identifier} has been successfully created!`);
    }

    if (rooms[identifier].type == Room_Type.private) {
				if (rooms[identifier].users_authorized[users[token].id] != true) {
					throw "This user is not authorized to access to this room.";
				}
    }

    // send every messages of the room
		for(let i = 0; i < rooms[identifier].messages.length; ++i) {
			client.emit('new_message', rooms[identifier].messages[i]);
		}

    client.join(identifier);

    this.room = identifier;
  });

  client.on('leave_room', (identifier) => {
    console.log(`A client left the room ${identifier}`);

    client.leave(identifier);
  });

  client.on('new_message', (message) => {

    if (this.room) {
      if (message.length == 0) return;

      const max_size = 1000;
      if (message.length > max_size) {
        message = message.substring(0, max_size);
      }

      const new_message = {
        text: message,
        date: new Date(),
        user: { // only useful user data
          id: users[token].id,
          username: users[token].username,
          name: users[token].name,
          picture: users[token].picture
        }
      };

      console.log(new_message)

      // everybody including the sender
      io.to(this.room).emit('new_message', new_message);

      rooms[this.room].date_last_messages = new Date().getTime();

      let length = rooms[this.room].messages.length;
      rooms[this.room].messages[length] = new_message;
    } else {
      console.log("You have to register to a room before!")
    }
  })
})
