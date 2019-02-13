const utils = require('../utils');

const connection = (client) => {
  const clientID = client.id;
  // retrieve the token sent by the client
  const token = client.handshake.query.token;

  console.log(`A client is connected! (${clientID})`);

  // decode the token
  const user = utils.decode_token(token);

  console.log(user)

  if (user) {
    console.log(`A client has been authorized from IP ${client.request.connection.remoteAddress}!`.green);

    if (!users[user.public_id])
      users[user.public_id] = user;
  } else {
    console.log(`A client has been rejected from IP ${client.request.connection.remoteAddress}!`.red);
  }

  client.on('disconnect', () =>	{
    console.log(`A client has been disconnected! (${clientID})`.red);
  });

  // A client wants to join a channel
  client.on('join_channel', (identifier) => {
    console.log(`A client asked to join the channel ${identifier}`.blue);

    const channel_type = utils.identify_channel_type(identifier);

    if (!channels[identifier]) {
      // the channel doesn't exit, we create it
      channels[identifier] = new Object();
      channels[identifier].messages = [];
      channels[identifier].creator_id = users[token].id;
      channels[identifier].type = channel_type;
      channels[identifier].users_authorized = [];
      channels[identifier].date_last_messages = 0;
      // only the creator of the channel is authorized
      channels[identifier].users_authorized[channels[identifier].creator_id] = true;

      console.log(`The channel ${identifier} has been successfully created!`.green);
    }

    // if the channel is private, we check if the user is authorized
    if (channels[identifier].type == Channel_Type.private && !channels[identifier].users_authorized[users[token].id]) {
  			throw "This user is not authorized to access to this channel.";
    }

    console.log(`A client joined successfully the channel ${identifier}`.green);
    // the client joins the channel
    client.join(identifier);

    // send every messages of the channel
  	for(let i = 0; i < channels[identifier].messages.length; ++i) {
  		client.emit('new_message', channels[identifier].messages[i]);
  	}

    this.channel = identifier;
  });

  // A client wants to leave a channel
  client.on('leave_channel', (identifier) => {
    console.log(`A client left the channel ${identifier}`.blue);

    // the client leaves the channel
    client.leave(identifier);
  });

  // A client is sending a message
  client.on('new_message', (message) => {

    console.log(`A client sent the message : ${message}`);

    if (this.channel) {
      // check if the message isn't empty
      if (message.length == 0) return;

      // limit the message to 1000 characters
      const max_size = 1000;
      if (message.length > max_size) {
        message = message.substring(0, max_size);
      }

      // we construct a new message
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

      console.log(new_message);

      // send to everybody in the channel including the sender
      io.to(this.channel).emit('new_message', new_message);

      // update the last message date of the channel
      channels[this.channel].date_last_messages = new Date().getTime();

      let length = channels[this.channel].messages.length;
      channels[this.channel].messages[length] = new_message;
    } else {
      console.log("The client has to join a channel before sending any message!".red)
    }
  })
}

module.exports = connection;
