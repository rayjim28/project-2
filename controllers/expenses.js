const Budget = require("../models/budget");
const Expense = require("../models/expense");

function show(req, res, next) {
  Budget.findById(req.params.id)
  .select('name amount category notes')
    .then((expense) => {
      console.log("expense:", expense);
      if (!expense) {
        throw new Error("Expense not found");
      }
      res.render("expenses/show", { 
        expense: {
          name: expense.name,
          amount: expense.amount !== undefined ? expense.amount.toFixed(2) : undefined,
          category: expense.category,
        }
      });
       
    })
    .catch(next);
}

function addExpense(req, res, next) {
  const { name, amount, category, date } = req.body;
  const newExpense = new Expense({
    name,
    amount,
    category,
    date,
    // title,
    // content,
    // user_id: req.user._id,
  });
  // find the budget to add the expense too
  Budget.findById(req.params.expenseId).then((budget) => {
    console.log("budget:", budget);
    // .then we are going to add our expense to the budgets expenses array
    budget.expenses.push(newExpense);
    // after that save it
    // make sure we redirect to the right place
    // see beth's add pokemon to team function
    newExpense
      .save()
      .then(() => {
        res.redirect("/budgets");
      })
      .catch(next);
  });
}

function deleteExpense(req, res, next) {
  Expense.findById(req.params.id)
    .then((expense) => {
      console.log("expense:", expense);
      if (!expense) {
        throw new Error("Expense not found");
      }
      if (!expense.user.equals(req.user._id)) {
        throw new Error("Unauthorized");
      }
      return expense.remove();
    })
    .then(() => {
      res.redirect("/expenses");
    })
    .catch(next);
}

function updateExpense(req, res, next) {
  // budget .findById takes in an id and fines the matching budget document "when promise resolved"
  Budget.findById(req.params.id)
    // after the promise is resolved we have the budget now lets do things
    .then((budget) => {
      const expense = budget.expenses.id(req.body.expenseId);
      if (!expense) {
        throw new Error("Expense not found");
      }
      expense.name = req.body.name;
      expense.amount = req.body.amount;
      // I want to update the expense to do so I have to find it first
      // After I find the expense I can change it
      // now that i've changed the sub document expense I need to save the changes and that is a clue in to how we do that the model .save()
      return budget.save();
    })
    .then(() => res.redirect(`/expenses${req.params.id}`))
    .catch(next);
}

module.exports = {
  show,
  addExpense,
  deleteExpense,
  updateExpense,
};
