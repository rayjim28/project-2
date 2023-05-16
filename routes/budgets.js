const express = require("express");
const router = express.Router();
const budgetCtrl = require("../controllers/budgets");
const budget = require('../models/budget');

router.get('/', budgetCtrl.index);

router.get('/new', budgetCtrl.newBudget);

router.post('/', budgetCtrl.create);

router.get('/:id', budgetCtrl.show);

router.get('/:id/edit', budgetCtrl.editBudget);

router.put('/:id', budgetCtrl.updateBudget);

router.delete('/:id', budgetCtrl.deleteBudget);

module.exports = router;