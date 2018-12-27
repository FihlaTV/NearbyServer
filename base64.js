const fs = require('fs').promises;
const config = require('./config.json');

const base64 = {
  // function to encode file data to base64 encoded string
  encode: async (file) => {
    // read binary data
    let bitmap = await fs.readFile(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  },
  // function to create file from base64 encoded string
  decode: (base64str, name, callback) => {
    let regex = /^data:image\/(.+);base64,(.*)$/;
    let matches = base64str.match(regex);
    let ext = matches[1];
    let data = matches[2];
    let file = name + '.' + ext;
    let buffer = new Buffer(data, 'base64');

    return fs.writeFile(config + file, buffer);
  }
};

module.exports = base64;
