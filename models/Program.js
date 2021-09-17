const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProgramSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: new Date().toDateString(),
  },
  author: {
    type: String,
    required: true,
  },
  programName: {
    type: String,
    required: true,
  },
  templates: {
    type: Array,
    required: true,
  },
});

const ProgramModel = mongoose.model("Programs", ProgramSchema);

module.exports = ProgramModel;
