const extractStatsFromWorkout = (workout) => {
  //want to take the workout data and return an array of objects (?) with all the relevant data which the stats records need to be updated with

  let sessionStats = [];

  workout.exerciseLogs.forEach((exerciseLog) => {
    let sessionValues = calculateSessionValues(exerciseLog);

    let exerciseSessionStats = {
      exercise: exerciseLog.exercise,
      date: workout.timestamp,
      values: {
        maxPerformed: sessionValues.maxPerformed,
        volumeThisSession: sessionValues.volumeThisSession,
        setsThisSession: sessionValues.setsThisSession,
        repsThisSession: sessionValues.repsThisSession,
        oneRepMax: sessionValues.oneRepMax,
      },
    };

    sessionStats.push(exerciseSessionStats);
  });

  return sessionStats;
};

function epleyOneRepMax(weight, reps) {
  return weight * (1 + reps / 30);
}

function calculateSessionValues(exerciseLog) {
  let maxPerformed = Math.max.apply(
    Math,
    exerciseLog.sets.map(function (set) {
      return set.weight;
    })
  );

  let setsThisSession = exerciseLog.sets.length;

  let repsThisSession = exerciseLog.sets.reduce((sum, set) => {
    return sum + set.reps;
  }, 0);

  let volumeThisSession = exerciseLog.sets.reduce((sum, set) => {
    return sum + set.reps * set.weight;
  }, 0);

  let oneRepMax = Math.max(
    ...exerciseLog.sets.map((set) =>
      Math.round(epleyOneRepMax(set.weight, set.reps))
    )
  );

  let values = {
    maxPerformed: maxPerformed,
    volumeThisSession: volumeThisSession,
    setsThisSession: setsThisSession,
    repsThisSession: repsThisSession,
    oneRepMax: oneRepMax,
  };

  return values;
}

module.exports = extractStatsFromWorkout;
