var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;


var todoSchema = new Schema({
  todo: { type: String, required: true },
  todoAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  completed:  { type: Boolean, required: false, default: false },
  priority: {type: String, required: true, default: 'Low' },

  dateCreated: { type: Date, required: true, default: Date.now },
  dateDue:  { type: String, required: true } 


});


var todo = Mongoose.model('Todo', todoSchema);

//module.exports = {
 //   Chirp: chirp
//};

module.exports = Mongoose.model('Todo',todoSchema);

