const express = require("express");
const router = express.Router();

const WorkoutModel = require("../../models/Workout");
const StatsModel = require("../../models/Stats");

const extractStatsFromWorkout = require("../../scripts/stats/statsScripts");

// @route /logNewWorkout
// @desc Route for logging a new workout
// @params id <String>, Workout Log <Object><WorkoutLog>
router.post("/logNewWorkout", (req, res) => {
  //check if workout already exists
  WorkoutModel.exists({ id: req.body.workoutToBeSaved.id })
    .then((workout) => {
      if (workout) {
        res.status(409).send();
      } else {
        let newWorkoutLog = new WorkoutModel({
          id: req.body.workoutToBeSaved.id,
          workoutName: req.body.workoutToBeSaved.workoutName,
          userID: req.body.workoutToBeSaved.userID,
          name: req.body.workoutToBeSaved.name,
          exerciseLogs: req.body.workoutToBeSaved.exerciseLogs,
        });

        newWorkoutLog
          //save log to db
          .save()
          .then((log) => {
            //update user's Stats with data from this log
            StatsModel.findOne({ userID: req.body.userID })
              .then((newStats) => {
                let sessionStats = extractStatsFromWorkout(
                  req.body.workoutToBeSaved
                );

                sessionStats.forEach((exerciseSessionStats) => {
                  if (
                    newStats.exercises.hasOwnProperty(
                      exerciseSessionStats.exercise
                    )
                  ) {
                    let newProgressionObject = {
                      date: exerciseSessionStats.date,
                      values: exerciseSessionStats.values,
                    };

                    //push new progressiong obkect
                    newStats.exercises[
                      exerciseSessionStats.exercise
                    ].progression.push(newProgressionObject);

                    //compare previous max performed with the max from this session and update if necessary
                    newStats.exercises[
                      exerciseSessionStats.exercise
                    ].maxPerformed = Math.max(
                      newStats.exercises[exerciseSessionStats.exercise]
                        .maxPerformed,
                      exerciseSessionStats.values.maxPerformed
                    );

                    //compare previous oneRepMax with the oneRepMax from this session and update if necessary
                    newStats.exercises[
                      exerciseSessionStats.exercise
                    ].oneRepMax = Math.max(
                      newStats.exercises[exerciseSessionStats.exercise]
                        .oneRepMax,
                      exerciseSessionStats.values.oneRepMax
                    );
                  } else {
                    //if the stats objects does not have this property, ie if this is the first time this exercise is logged
                    let newProgressionObject = {
                      date: exerciseSessionStats.date,
                      values: exerciseSessionStats.values,
                    };

                    let newExerciseObject = {
                      progression: [newProgressionObject],
                      maxPerformed: exerciseSessionStats.values.maxPerformed,
                      oneRepMax: exerciseSessionStats.values.oneRepMax,
                    };

                    newStats.exercises[exerciseSessionStats.exercise] =
                      newExerciseObject;
                  }
                });

                //indicate to the db controller that exercises has been modified
                newStats.markModified("exercises");
                newStats
                  .save()
                  .then((stats) => {
                    res.status(200).send(stats);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send();
                  });
                // .catch((err) => console.log(err));
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send();
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send();
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

module.exports = router;
