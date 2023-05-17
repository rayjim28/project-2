const mongoose = require('mongoose');
const notesSchema = require('./note');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['housing'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: [notesSchema]
});



module.exports = mongoose.model('Budget', budgetSchema);