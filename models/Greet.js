const mongoose = require('mongoose');

const greetSchema = new mongoose.Schema({
  greet: {
    type: String,
   
  },
  message: {
    type: String,

  }
 
});

const Greet = mongoose.model('Greet', greetSchema);

module.exports = Greet;