const express = require("express");
const router = express.Router();

//MODELS
const UserModel = require("../../models/User");
const ProgramModel = require("../../models/Program");

// router.post("/updateUsers", (req, res) => {
//   UserModel.updateMany({}, { $set: { stats: {} } })
//     .then(() => {
//       res.send("WORKED");
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send("error");
//     });
// });

//@route userData/programs/retrievePrograms
//@desc route for retrieving user programs for display
//@fields workoutTemplateIDs <Array>
router.post("/retrievePrograms", (req, res) => {
  console.log("Retreive programs route hit");
  //check if username is taken
  ProgramModel.find({ id: { $in: req.body.programIDsToBeRetrieved } })
    .then((results) => {
      res.status(200).send({ retrievedPrograms: results });
    })
    .catch((err) => {
      console.log(err);
      res.status(504).send();
    });
});

//@route userData/programs/updateProgramIDs
//@desc route for updating which program IDs are tied to this user's account
//@fields id <String>, workoutTemplateIDs <Array>
router.post("/updateProgramIDs", (req, res) => {
  // console.log("Update program IDs route hit", req.body.user);
  //check if username is taken
  UserModel.findOne({ id: req.body.user.id })
    .then((user) => {
      if (user) {
        console.log("USER FOUND (update program IDs route)");
        user.programIDs = req.body.user.programIDs;
        user
          .save()
          .then(() => {
            console.log("New program IDs saved");
            res.status(200).send();
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send();
          });
      } else {
        res.status(409).send("ERROR! User doesn't exists");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//@route userData/programs/saveNewProgram
//@desc route for saving a newly created program in the cloud databse
//@fields id <String>, date <Date>, author <String>, programName <String>, templates <Array>
router.post("/saveNewProgram", (req, res) => {
  console.log("Save new program route hit");
  //check if program exists
  ProgramModel.findOne({ id: req.body.program.id })
    .then((program) => {
      if (program) {
        console.log("Program Found (in 'create new' route)");
        res.status(400).send("Program already exists");
      } else {
        console.log("Program on server side:::", req.body.program);
        let newProgram = new ProgramModel(req.body.program);

        newProgram
          .save()
          .then((program) => {
            console.log(
              "New program saved successfully: ",
              program.programName
            );
            res.status(200).send("New program saved successfully");
          })
          .catch((err) => {
            res.status(500).send("Error while trying to save");
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//@route updateUserCurrentProgram
//@desc update the user's current active program
//@fields user, program
router.post("/updateUserCurrentProgram", (req, res) => {
  console.log("update user current program route hit, ");
  UserModel.findOne({ id: req.body.user.id })
    .then((user) => {
      if (user) {
        let updatedUser = user;

        updatedUser.currentProgram.program = req.body.program;
        updatedUser.currentProgram.step = 0;

        updatedUser
          .save()
          .then((user) => {
            console.log("User Current Program sucessfully updated");
            res
              .status(200)
              .send("User Current Program sucessfully updated Current ");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send();
          });
      } else {
        res.status(400).send("User not found");
      }
    })
    .catch((err) => console.log(err));
});

//@route incrementUserCurrentProgramStep
//@desc increments the step counter for the user's current program
//@fields user
router.post("/incrementUserCurrentProgramStep", (req, res) => {
  console.log("increment user current program  step route hit");
  UserModel.findOne({ id: req.body.user.id })
    .then((user) => {
      if (user) {
        let updatedUser = user;

        updatedUser.currentProgram.step++;

        updatedUser
          .save()
          .then((user) => {
            console.log("User Current Program Step sucessfully incremented");
            res
              .status(200)
              .send("User Current Program Step sucessfully incremented");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send();
          });
      } else {
        res.status(400).send("User not found");
      }
    })
    .catch((err) => console.log(err));
});

//@route userData/props/deleteProgram
//@desc route for deleting user workout templates
//@fields programID <String>
router.post("/deleteProgram", (req, res) => {
  console.log("Delete templates route hit, ID: ", req.body.id);
  //find programs associated with this user ID
  ProgramModel.findOne({ id: req.body.id })
    .then((result) => {
      if (result.id === req.body.id) {
        TemplateModel.deleteOne({ id: req.body.id })
          .then((results) => res.status(200).send())
          .catch((err) => console.log(err));
      } else {
        console.log("Template not found");
        console.log(result);
        res.status(504).send();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(504).send();
    });
});

module.exports = router;
