const express = require('express');
const router = express.Router();
const notesCtrl = require('../controllers/notes');

// Show a note
router.get('/:id', notesCtrl.show);

// Add a note
router.post('/', notesCtrl.addNote);

// Delete a note
router.delete('/:id', notesCtrl.deleteNote);

module.exports = router;