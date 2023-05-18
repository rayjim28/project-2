const Budget = require('../models/budget');
const {categories} = require('../models/expense');

function index(req, res, next) {
  // this prevents unauth access
  if (!req.user) {
    return res.redirect('/');
  }
  Budget.find({ user_id: req.user._id })
    .then((budgets) => {
      console.log('budgets:', budgets);
      res.render('budgets/index', {
        budgets,
        title: 'All Budgets',
      });
    })
    .catch(next);
}

function create(req, res, next) {
  const { name, amount, note } = req.body;
  const b = new Budget({
    name,
    user_id: req.user._id,
    note
  })
  b.incomes.push({amount})
  console.log('req.body in budget create', req.body)
  console.log('>'.repeat(30), b)
  b.save()
    .then((b) => res.redirect(`/budgets/${b._id}`))
    .catch(next);
}

function show(req, res, next) {
  Budget.findById(req.params.id)
  .populate('expenses')
    .then((budget) => {
      console.log('budget:', budget);
      res.render('budgets/show', {
        budget,
        categories,
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
        categories,
        title: 'Edit Budget',
      });
    })
    .catch(next);
}

// function calculateIncomeAfterExpenses(req, res, next) {
//   const { income } = req.body;
//   Budget.find({ user_id: req.user._id })
//     .then((budgets) => {
//       console.log('budgets:', budgets);
//       const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);
//       console.log('totalAmount:', totalAmount);
//       const incomeAfterExpenses = income - totalAmount;
//       console.log('incomeAfterExpenses:', incomeAfterExpenses);
//       res.render('/budgets/index', {
//         title: 'My Budgets',
//         income: incomeAfterExpenses,
//       });
//     })
//     .catch(next);
// }

module.exports = {
  index,
  create,
  show,
  updateBudget,
  deleteBudget,
  editBudget,
};
