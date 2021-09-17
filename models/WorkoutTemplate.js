const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let WorkoutTemplateSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  userIDs: {
    type: Array,
    required: true,
  },
  templateName: {
    type: String,
    required: true,
  },
  exerciseSchemes: [
    {
      exercise: String,
      repScheme: [
        {
          reps: Number,
          sets: Number,
        },
      ],
    },
  ],
});

const WorkoutTemplateModel = mongoose.model(
  "Workout Templates",
  WorkoutTemplateSchema
);

module.exports = WorkoutTemplateModel;
