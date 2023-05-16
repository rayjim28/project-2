const Budget = require("../models/budget");

function index(req, res, next) {
  Budget.find({ user_id: req.user._id })
    .then((budgets) => {
      res.render("budgets/index", {
        budgets,
        title: "My Budgets",
      });
    })
    .catch(next);
}

function newBudget(req, res) {
  res.render("budgets/new", { title: "New Budget" });
}

function create(req, res, next) {
  req.body.user_id = req.user._id;
  Budget.create(req.body)
    .then(() => res.redirect("/budgets"))
    .catch(next);
}

function show(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      res.render("budgets/show", {
        budget,
        title: "Budget Details",
      });
    })
    .catch(next);
}

function updateBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget.user_id.equals(req.user._id)) throw new Error("Unauthorized");
      Object.assign(budget, req.body);
      return budget.save();
    })
    .then(() => res.redirect(`/budgets/${req.params.id}`))
    .catch(next);
}

function update(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget.user.equals(req.user._id)) {
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
      if (!budget.user_id.equals(req.user._id)) throw new Error("Unauthorized");
      return budget.deleteOne();
    })
    .then(() => res.redirect("/budgets"))
    .catch(next);
}

function editBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget) {
        throw new Error('Budget not found');
      }
      res.render('budgets/edit', {
        budget,
        title: 'Edit Budget',
      });
    })
    .catch(next);
}

module.exports = {
  index,
  newBudget,
  create,
  show,
  updateBudget,
  update,
  deleteBudget,
  editBudget
};
