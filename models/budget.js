const mongoose = require("mongoose");
const expenseSchema = require("./expense");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
  expenses: [expenseSchema],
  income: 
    {
      amount: {
        type: Number,
        required: true,
        default: 0
      },
    },
  
});

module.exports = mongoose.model("Budget", budgetSchema);
