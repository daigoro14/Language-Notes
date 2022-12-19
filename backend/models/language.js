const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  languageName: {type: String, unique: true}
})

const Language = mongoose.model("Language", languageSchema);

exports.Language = Language;