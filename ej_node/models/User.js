var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    set: function(value) {return value.trim().toLowerCase()},
    validate: [
      function(email) {
        return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null)},
      'Invalid email'
    ]
  },
  password: String,
  name: String,
  given_name: String,
  family_name: String,
  link: String,
  picture: String,
  gender: String,
  locale: String,
  admin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);