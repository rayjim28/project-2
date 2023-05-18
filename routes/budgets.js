const express = require('express');
const router = express.Router();
const budgetCtrl = require('../controllers/budgets');

router.get('/', budgetCtrl.index);

router.get('/:id', budgetCtrl.show);

router.get('/:id/edit', budgetCtrl.editBudget);

router.post('/', budgetCtrl.create);

router.put('/:id', budgetCtrl.updateBudget);

router.delete('/:id', budgetCtrl.deleteBudget);


module.exports = router;