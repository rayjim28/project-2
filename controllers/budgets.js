const Budget = require("../models/budget");
const { categories } = require("../models/expense");

function index(req, res, next) {
  // this prevents unauth access
  if (!req.user) {
    return res.redirect("/");
  }
  Budget.find({ user_id: req.user._id })
    .then((budgets) => {
      res.render("budgets/index", {
        budgets,
        title: "All Budgets",
      });
    })
    .catch(next);
}

function create(req, res, next) {
  const { name, amount } = req.body;
  const b = new Budget({
    name,
    user_id: req.user._id,
  });
  b.incomes.push({ amount });
  b.save()
    .then((b) => res.redirect(`/budgets/${b._id}`))
    .catch(next);
}

function show(req, res, next) {
  Budget.findById(req.params.id)
    .populate("expenses")
    .then((budget) => {
      res.render("budgets/show", {
        budget,
        categories,
        title: "Budget Details",
      });
    })
    .catch(next);
}

function updateBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget.user_id.equals(req.user._id)) {
        throw new Error("Unauthorized");
      }
      return budget.updateOne(req.body);
    })
    .then(() => res.redirect(`/budgets/${req.params.id}`))
    .catch(next);
}

function deleteBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget.user_id.equals(req.user._id)) {
        throw new Error("Unauthorized");
      }
      return budget.deleteOne();
    })
    .then(() => res.redirect("/budgets"))
    .catch(next);
}

function editBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget) {
        throw new Error("Budget not found");
      }
      res.render("budgets/edit", {
        budget,
        categories,
        title: "Edit Budget",
      });
    })
    .catch(next);
}

module.exports = {
  index,
  create,
  show,
  updateBudget,
  deleteBudget,
  editBudget,
};
