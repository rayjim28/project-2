const Budget = require("../models/budget");
const Note = require("../models/note");

function show(req, res, next) {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        throw new Error("Note not found");
      }
      res.render("note/show", { note });
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
  newNote
    .save()
    .then(() => {
      res.redirect("/notes");
    })
    .catch(next);
}

function deleteNote(req, res, next) {
  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        throw new Error("Note not found");
      }
      if (!note.user.equals(req.user._id)) {
        throw new Error("Unauthorized");
      }
      return note.remove();
    })
    .then(() => {
      res.redirect("/notes");
    })
    .catch(next);
}

module.exports = {
  show,
  addNote,
  deleteNote,
};
