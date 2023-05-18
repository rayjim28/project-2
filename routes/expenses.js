const express = require('express');
const expensesCtrl = require('../controllers/expenses');

const router = express.Router();

router.get('/budgets/:id/expenses/new', expensesCtrl.newExpense);

router.get('/budgets/:id/expenses/:expense_id', expensesCtrl.show);
router.get('/budgets/:id/expenses/:expense_id/edit', expensesCtrl.edit);

router.post('/budgets/:id/expenses', expensesCtrl.addExpense);

router.put('/budgets/:id/expenses/:expense_id', expensesCtrl.updateExpense);

router.delete('/budgets/:id/expenses/:expense_id', expensesCtrl.deleteExpense);

module.exports = router;