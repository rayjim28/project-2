const Budget = require("../models/budget");
const { Expense, categories } = require("../models/expense");

function newExpense(req, res) {
  // this prevents unauth access
  if (!req.user) {
    return res.redirect("/");
  }
  res.render("expenses/new", {
    title: "New Expense",
    budget_id: req.params.id,
    categories,
  });
}

function edit(req, res) {
  // this prevents unauth access
  if (!req.user) {
    return res.redirect("/");
  }
  Expense.findById(req.params.expense_id).then((expense) => {
    res.render("expenses/edit", {
      title: "Edit Expense",
      expense,
      budget_id: req.params.id,
      categories,
    });
  });
}

function show(req, res, next) {
  // this prevents unauth access
  if (!req.user) {
    return res.redirect("/");
  }
  Expense.findById(req.params.expense_id)
    .then((expense) => {
      if (!expense) {
        throw new Error("Expense not found");
      }
      res.render("expenses/show", {
        budget_id: req.params.id,
        expense: {
          name: expense.name,
          amount:
            expense.amount !== undefined
              ? expense.amount.toFixed(2)
              : undefined,
          category: expense.category,
        },
      });
    })
    .catch(next);
}

function addExpense(req, res, next) {
  const { name, amount, category, date } = req.body;
  const budgetId = req.params.id;
  const newExpense = new Expense({
    name,
    amount,
    category,
    date,
  });
  Budget.findById(budgetId).then((budget) => {
    newExpense
      .save()
      .then(() => {
        budget.expenses.push(newExpense._id);
        return budget.save();
      })
      .then(() => {
        res.redirect(`/budgets/${budgetId}`);
      })
      .catch(next);
  });
}

function deleteExpense(req, res, next) {
  const budgetId = req.params.id;
  Expense.findById(req.params.expense_id)
    .then((expense) => {
      if (!expense) {
        throw new Error("Expense not found");
      }
      return expense.deleteOne();
    })
    .then(() => {
      return Budget.findById(budgetId);
    })
    .then((budget) => {
      // reminder to fix bug
      // remove expense from budget.expenses
      return budget.save();
    })
    .then(() => {
      res.redirect(`/budgets/${budgetId}`);
    })
    .catch(next);
}

function updateExpense(req, res, next) {
  Expense.findById(req.params.expense_id)
    .then((expense) => {
      if (!expense) {
        throw new Error("Expense not found");
      }
      expense.name = req.body.name;
      expense.amount = req.body.amount;
      return expense.save();
    })
    .then(() =>
      res.redirect(
        `/budgets/${req.params.id}/expenses/${req.params.expense_id}`
      )
    )
    .catch(next);
}

module.exports = {
  show,
  edit,
  newExpense,
  addExpense,
  deleteExpense,
  updateExpense,
};
