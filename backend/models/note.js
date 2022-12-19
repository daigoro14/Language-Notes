const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    firstLanguage: {type: String},
    secondLanguage: {type: String},
    languageName: {type: String},
    learnt: {type: Boolean, default: false},
    date: {type: Date, default: Date.now}
})

const Note = mongoose.model("Note", noteSchema);

exports.Note = Note;
