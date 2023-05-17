const Budget = require('../models/budget');
const Note = require('../models/note');

function show(req, res, next) {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        throw new Error('Note not found');
      }
      res.render('note/show', { note });
    })
    .catch(next);
}

function addNote(req, res, next) {
  const { title, content } = req.body;
  const newNote = new Note({
    title,
    content,
    user: req.user._id,
  });
  // find the budget to add the note too
  Budget.findById(req.params.budgetId)
  // .then we are going to add our note to the budgets notes array
  // after that save it
  // make sure we redirect to the right place
  // see beth's add pokemon to team function
  newNote
    .save()
    .then(() => {
      res.redirect('/budgets');
    })
    .catch(next);
}

function deleteNote(req, res, next) {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        throw new Error('Note not found');
      }
      if (!note.user.equals(req.user._id)) {
        throw new Error('Unauthorized');

      }
      return note.remove();
    })
    .then(() => {
      res.redirect('/notes');
    })
    .catch(next);
}

module.exports = {
  show,
  addNote,
  deleteNote,
};
