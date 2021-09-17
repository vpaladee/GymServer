const express = require("express");
const router = express.Router();

//MODELS
const UserModel = require("../../models/User");
const TemplateModel = require("../../models/WorkoutTemplate");

//@route userData/workoutTemplates/saveNewWorkoutTemplate
//@desc save a new workout template to the cloud db
//@req id - id of workout template to be saved
//@fields workoutTemplate => id, userIDs, templateName, exerciseSchemes
router.post("/saveNewWorkoutTemplate", (req, res) => {
  TemplateModel.findOneAndUpdate(
    {
      id: req.body.workoutTemplateToBeSaved.id,
    },
    {
      id: req.body.workoutTemplateToBeSaved.id,
      userIDs: req.body.workoutTemplateToBeSaved.userIDs,
      templateName: req.body.workoutTemplateToBeSaved.templateName,
      exerciseSchemes: req.body.workoutTemplateToBeSaved.exerciseSchemes,
    },
    { upsert: true }
  )

    .then((template) => {
      res.status(200).send(template);
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.post("/saveNewWorkoutTemplate", (req, res) => {
//   TemplateModel.findOne({
//     id: req.body.workoutTemplateToBeSaved.id,
//   })
//     .then((workoutTemplate) => {
//       if (workoutTemplate) {
//         console.log("Error: workout template already exists");
//         res.status(409).send("ERROR! Workout Template already exists");
//       } else {
//         let newWorkoutTemplate = new TemplateModel({
//           id: req.body.workoutTemplateToBeSaved.id,
//           userIDs: req.body.workoutTemplateToBeSaved.userIDs,
//           templateName: req.body.workoutTemplateToBeSaved.templateName,
//           exerciseSchemes: req.body.workoutTemplateToBeSaved.exerciseSchemes,
//         });

//         newWorkoutTemplate
//           .save()
//           .then((log) => {
//             res.status(200).send(log);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//     })
//     .catch((err) => console.log(err));
// });

//@route userData/workoutTemplates/updateWorkoutTemplateIDs
//@desc route for updating which workout template IDs are tied to a user's account
//@fields id <String>, workoutTemplateIDs <Array>
router.post("/updateWorkoutTemplateIDs", (req, res) => {
  console.log("Update template IDs route hit", req.body.user);
  //check if username is taken
  UserModel.findOne({ id: req.body.user.id })
    .then((user) => {
      if (user) {
        console.log("USER FOUND | updateWorkoutTemplateIDs");
        user.workoutTemplateIDs = req.body.user.workoutTemplateIDs;
        user
          .save()
          .then(() => {
            console.log("New workout template IDs saved");
            res.status(200).send();
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send();
          });
      } else {
        console.log("ERROR HERE");
        res.status(409).send("ERROR! User doesn't exists");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//@route userData/workoutTemplates/retrieveWorkoutTemplates
//@desc route for retrieving user workout templates for display i UI
//@fields workoutTemplateIDs <Array>
router.post("/retrieveWorkoutTemplates", (req, res) => {
  console.log("Retreive templates route hit, user id: ", req.body.userID);
  //find templates associated with this user ID
  TemplateModel.find({ userIDs: req.body.userID })
    .then((results) => {
      console.log(
        "number of workout templates found | retrieve workout templates: ",
        results.length
      );
      res.status(200).send({ retrievedTemplates: results });
    })
    .catch((err) => {
      console.log(err);
      res.status(504).send();
    });
});

//@route userData/workoutTemplates/deleteWorkoutTemplate
//@desc route for deleting user workout templates
//@fields workoutTemplateID <String>
router.post("/deleteWorkoutTemplate", (req, res) => {
  console.log("Delete templates route hit, ID: ", req.body.id);
  //find templates associated with this user ID
  TemplateModel.findOne({ id: req.body.id })
    .then((result) => {
      if (result.id === req.body.id) {
        TemplateModel.deleteOne({ id: req.body.id })
          .then((results) => res.status(200).send())
          .catch((err) => console.log(err));
      } else {
        console.log("template not found");
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
