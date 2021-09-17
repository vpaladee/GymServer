const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let StatsSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  exercises: {},
});

const StatsModel = mongoose.model("Stats", StatsSchema);

module.exports = StatsModel;
