const express = require('express');
const router = express.Router();
const expensesCtrl = require('../controllers/expenses');

router.get('/:id', expensesCtrl.show);

router.post('/', expensesCtrl.addExpense);

router.delete('/:id', expensesCtrl.deleteExpense);

router.put('/:id', expensesCtrl.updateExpense);

module.exports = router;