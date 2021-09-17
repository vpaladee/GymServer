const express = require("express");
const router = express.Router();

const extractStatsFromWorkout = require("../../scripts/stats/statsScripts");

const StatsModel = require("../../models/Stats");

// @route /userData/stats/retrieveStats
router.post("/retrieveStats", (req, res) => {
  StatsModel.find({ userID: req.body.userID })
    .then((stats) => {
      res.send(stats);
    })
    .catch((err) => console.log(err));
});

router.post("/retrieveExerciseStats", (req, res) => {
  console.log("inside retrieveExerciseData");
  let field = req.body.exerciseName;
  console.log("Getting::", field);
  StatsModel.findOne({ userID: req.body.userID })
    // .select(field)
    .select({ ["exercises." + field]: 1 })
    // .select(req.body.exerciseName.toString())
    .then((stats) => {
      console.log("Data sent |", stats);
      res.status(200).send(stats);
    })
    .catch((err) => console.log(err));
});

// @route /userData/stats/logNewStats
router.post("/logNewStats", (req, res) => {
  console.log("In logNewStats");
  StatsModel.findOne({ userID: req.body.userID })
    .then((stats) => {
      let sessionStats = extractStatsFromWorkout(req.body.workout);
      let newStats = stats;

      sessionStats.forEach((exerciseSessionStats) => {
        //if values for the exervise already exist:
        if (newStats.exercises.hasOwnProperty(exerciseSessionStats.exercise)) {
          let newProgressionObject = {
            date: exerciseSessionStats.date,
            values: exerciseSessionStats.values,
          };

          //push new progressiong obkect
          newStats.exercises[exerciseSessionStats.exercise].progression.push(
            newProgressionObject
          );

          //compare previous max performed with the max from this session and update if necessary
          newStats.exercises[exerciseSessionStats.exercise].maxPerformed =
            Math.max(
              newStats.exercises[exerciseSessionStats.exercise].maxPerformed,
              exerciseSessionStats.values.maxPerformed
            );

          //compare previous oneRepMax with the oneRepMax from this session and update if necessary
          newStats.exercises[exerciseSessionStats.exercise].oneRepMax =
            Math.max(
              newStats.exercises[exerciseSessionStats.exercise].oneRepMax,
              exerciseSessionStats.values.oneRepMax
            );
          res.send(200);
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

          newStats.exercises[exerciseSessionStats.exercise] = newExerciseObject;
        }
      });
      console.log("Saving Stats | logNewStats");

      stats = newStats;

      console.log("Stats Object | logNewStats::", stats);
      stats
        .save()
        .then((stats) => {
          res.status(200).send(stats);
        })
        .catch((err) => {
          console.log(err);
          console.log("logNewStats Route");
          res.status(500).send();
        });
      // .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
      console.log("logNewStats Route");
      res.status(500).send();
    });
});

// @route /userData/stats/createStats
router.post("/createStats", (req, res) => {
  StatsModel.findOne({ userID: req.body.userID }).then((stats) => {
    if (stats) {
      console.log("Stats already exist | createStats");
      res.status(409).send();
    } else {
      let newStats = new StatsModel({
        userID: req.body.userID,
        exercises: {
          "Bench Press": {
            progression: [],
            maxPerformed: 0,
            oneRepMax: 0,
          },
        },
      });

      newStats
        .save()
        .then((stats) => {
          console.log(stats);
          res.send("Done");
        })
        .catch((err) => console.log(err));
    }
  });
});

module.exports = router;
