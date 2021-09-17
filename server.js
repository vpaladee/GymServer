const express = require("express");

const app = express();

const mongoose = require("mongoose");

app.use(express.json());

//connect to db
const dbURI = require("./dbconfig/dbconfig").dbURI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

//import route files for use
const workoutRoutes = require("./routes/userData/workoutRoutes");
const authRoutes = require("./routes/auth/userAuthentication");
const workoutTemplateRoutes = require("./routes/userData/workoutTemplateRoutes");
const programRoutes = require("./routes/userData/programRoutes");
const statsRoutes = require("./routes/userData/statsRoutes");

//routes
app.use("/userData/exerciseLogs", workoutRoutes);
app.use("/auth", authRoutes);
app.use("/userData/workoutTemplates", workoutTemplateRoutes);
app.use("/userData/programs", programRoutes);
app.use("/userData/stats", statsRoutes);

//init
const port = process.env.PORT || 5001;

app.listen(port, () => console.log("Server Running on port ", port, " ..."));
