// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

<<<<<<< HEAD
var connection = mongoose.createConnection("mongodb://localhost:27017/boobooline");
autoIncrement.initialize(connection);

// create a schema
var messageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true }
}, { collection: "messages" });

=======

// create a schema
var messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true }
}, { collection: "messages", timestamps: { createdAt: 'created_at' }});
/*
>>>>>>> b926b007c5f8940f71eb45735cdc0e571bca179b
messageSchema.plugin(autoIncrement.plugin, {
    model: 'Message',
    field: 'messageId'
});
*/
messageSchema.plugin(timestamps);

// the schema is useless so far
// we need to create a model using it
const Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;