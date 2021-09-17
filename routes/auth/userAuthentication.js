const express = require("express");
const router = express.Router();
const uudiv4 = require("uuid").v4;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey = require("../../env/keys").jwt;

const UserModel = require("../../models/User");

//Test Connection to db
router.post("/testConnection", (req, res) => {
  res.send("working");
});

// @route updateUsers
// @desc add new fields to all existing users
router.post("/updateUsers", (req, res) => {
  UserModel.updateMany({
    $set: {
      currentProgram: {
        program: {},
        step: 0,
      },
    },
  })
    .then(res.send("Finished"))
    .catch((err) => console.log(err));
});

//@route signup
//@desc route for users to register a new account
//@fields username, emailAddress, password
router.post("/signup", (req, res) => {
  console.log("Sign Up route hit");
  //check if username is taken
  UserModel.findOne({
    $or: [
      { username: req.body.user.username },
      { emailAddress: req.body.user.emailAddress },
    ],
  })
    .then((user) => {
      if (user) {
        console.log("USER ALREADY EXISTS");
        res.status(409).send("ERROR! User already exists");
      } else {
        //if not create new user object and save
        let newUser = new UserModel({
          id: uudiv4(),
          username: req.body.user.username,
          emailAddress: req.body.user.emailAddress,
        });

        //encrypt password
        (newUser.password = newUser.encryptPassword(req.body.user.password)),
          newUser
            .save()
            .then((user) => {
              let {
                id,
                username,
                emailAddress,
                workoutIDs,
                workoutTemplateIDs,
                programIDs,
                currentProgram,
              } = user;

              let userObjectToBeSent = {
                id: id,
                username: username,
                emailAddress: emailAddress,
                workoutIDs: workoutIDs,
                workoutTemplateIDs: workoutTemplateIDs,
                programIDs: programIDs,
                currentProgram: currentProgram,
              };
              res.status(200).send(userObjectToBeSent);
            })
            .catch((err) => {
              console.log(err);
            });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//@route login
//@desc route for users to login
router.post("/login", (req, res) => {
  console.log("Login route hit");
  UserModel.findOne({
    $or: [
      { username: req.body.user.usernameOrEmailAddress },
      { emailAddress: req.body.user.usernameOrEmailAddress },
    ],
  }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(req.body.user.password, user.password)) {
        console.log("Log In successful");
        const tokenPayload = {
          id: user.id,
          username: user.username,
        };
        let token = jwt.sign(tokenPayload, jwtKey);

        res.status(200).send({
          token: token,
          user: {
            id: user.id,
            username: user.username,
            workoutIDs: user.workoutIDs,
            workoutTemplateIDs: user.workoutTemplateIDs,
            programIDs: user.programIDs,
            currentProgram: user.currentProgram,
          },
        });
      } else if (!bcrypt.compareSync(req.body.user.password, user.password)) {
        res.status(401).send("Incorrect password");
      } else {
        res.status(500).send("error");
      }
    } else {
      res.status(400).send("User does not exist");
    }
  });
});

//@route verifyToken
//@desc route for users to login
router.post("/verifyToken", (req, res) => {
  console.log("verify route hit");

  jwt.verify(req.body.token, jwtKey, function (err, payload) {
    if (err) {
      console.log(err);
      res.status(400).send();
    }
    console.log("TOKEN:::", req.body.token);
    console.log("PAYLOAD::", payload);
    UserModel.findOne({ username: payload.username })
      .then((user) => {
        if (user) {
          res.status(200).send({
            user: {
              id: user.id,
              username: user.username,
              workoutIDs: user.workoutIDs,
              programIDs: user.programIDs,
              currentProgram: user.currentProgram,
            },
          });
        } else {
          res.status(500).send();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  });
});

module.exports = router;
