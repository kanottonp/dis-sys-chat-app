// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');


// create a schema
var messageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    number: { type: Number, required: true }
}, { collection: "messages", timestamps: { createdAt: 'created_at' } });
/*
messageSchema.plugin(autoIncrement.plugin, {
    model: 'Message',
    field: 'messageId'
});
*/
messageSchema.set('autoIndex', false);
messageSchema.plugin(timestamps);

// the schema is useless so far
// we need to create a model using it
const Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;