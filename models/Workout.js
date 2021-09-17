const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let WorkoutSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  workoutName: {
    type: String,
    required: true,
  },
  exerciseLogs: [
    {
      exercise: { type: String, required: true },
      sets: [
        {
          reps: Number,
          weight: Number,
        },
      ],
    },
  ],
});

const WorkoutModel = mongoose.model("Workouts", WorkoutSchema);

module.exports = WorkoutModel;
