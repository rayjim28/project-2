const Budget = require('../models/budget');

function index(req, res, next) {
  if (!req.user) {
    return res.redirect('/');
  }
  Budget.find({ user_id: req.user._id })
    .then((budgets) => {
      console.log('budgets:', budgets);
      res.render('budgets/index', {
        budgets,
        title: 'My Budgets',
      });
    })
    .catch(next);
}

function newBudget(req, res) {
  res.render('budgets/new', { title: 'New Budget' });
}

function create(req, res, next) {
  req.body.user_id = req.user._id;
  // const { name, income, note } = req.body;
  // { name, income, note }
  console.log('req.body in budget create', req.body)
  Budget.create(req.body)
    .then(() => res.redirect('/budgets'))
    .catch(next);
}

function show(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      console.log('budget:', budget);
      res.render('budgets/show', {
        budget,
        title: 'Budget Details',
      });
    })
    .catch(next);
}

function updateBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      console.log('budget:', budget);
      console.log('req.user:', req.user);
      if (!budget.user_id.equals(req.user._id)) {
        throw new Error('Unauthorized');
      }
      return budget.updateOne(req.body);
    })
    .then(() => res.redirect(`/budgets/${req.params.id}`))
    .catch(next);
}

function deleteBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      console.log('budget:', budget);
      if (!budget.user_id.equals(req.user._id)) {
        throw new Error('Unauthorized');
      }
      return budget.deleteOne();
    })
    .then(() => res.redirect('/budgets'))
    .catch(next);
}

function editBudget(req, res, next) {
  Budget.findById(req.params.id)
    .then((budget) => {
      console.log('budget:', budget);
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

function calculateIncomeAfterExpenses(req, res, next) {
  const { income } = req.body;
  Budget.find({ user_id: req.user._id })
    .then((budgets) => {
      console.log('budgets:', budgets);
      const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);
      console.log('totalAmount:', totalAmount);
      const incomeAfterExpenses = income - totalAmount;
      console.log('incomeAfterExpenses:', incomeAfterExpenses);
      res.render('/budgets/index', {
        title: 'My Budgets',
        income: incomeAfterExpenses,
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
  deleteBudget,
  editBudget,
  calculateIncomeAfterExpenses,
};
