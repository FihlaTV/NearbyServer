var Validator = require('jsonschema').Validator;

let user = {
   "id": "/userCreate",
   "type": "object",
   "properties": {
      "uid": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
      },
      "username": {
        "type": "string",
        "minLength": 3,
        "maxLength": 20
      },
      "email": {
        "type": "string",
        "pattern": "^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$"
      },
      "password": {
        "type": "string",
        "minLength": 128,
        "maxLength": 128
      },
      "salt": {
        "type": "string",
        "minLength": 16,
        "maxLength": 16
      },
      "birthday": {
        "type": "date-time",
        "minLength": 24,
        "maxLength": 24
      },
      "gender": {
        "type": "string",
        "enum": ["male", "female", "none"]
      },
      "picture": { "type": "string" },
      "background": { "type": "string" },
      "lang": {"type": "string", "maxLength": 6}
   },
   "required": ["uid", "username", "email", "password", "salt", "birthday", "gender", "lang"]
};
