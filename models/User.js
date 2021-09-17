const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  programIDs: {
    type: Array,
    default: [],
  },
  currentProgram: {
    program: {},
    step: {
      type: Number,
      default: 0,
    },
  },
  stats: {},
});

UserSchema.methods.encryptPassword = function (password) {
  const encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  return encryptedPassword;
};

// UserSchema.methods.verifyPassword = function(enteredPassword, passwordStoredInDatabase) {
//   return bcrypt.compareSync(enteredPassword, passwordStoredInDatabase)
// }

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
