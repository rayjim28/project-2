const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is where I can add more categories
const categories = ['Housing', 'Medical', 'Groceries', 'Car'];

const expenseSchema = new Schema({
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
    required: true,
    enum: categories,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = {
  categories,
  Expense: mongoose.model('Expense', expenseSchema)
};
