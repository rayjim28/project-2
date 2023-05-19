const mongoose = require("mongoose");
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
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expense",
    required: true,
  }],
  incomes:
    [{
      amount: {
        type: Number,
        required: true,
        default: 0
      },
      name: {
        type: String,
        required: false
      }
    }],
});

module.exports = mongoose.model("Budget", budgetSchema);
