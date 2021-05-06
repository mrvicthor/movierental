require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { PORT, MONGODB_URI } = process.env;
const express = require("express");
const app = express();
const movieController = require("./controllers/movie");
const User = require("./models/User");
const expressSession = require("express-session");

const userController = require("./controllers/user");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: "foo barr",
    cookie: { expires: new Date(253402300000000) },
  })
);

mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to movie database");
  }
);

global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
});

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect("/");
  }
  next();
};

mongoose.connection.on("error", (err) => {
  console.log(err);
  console.log("MongoDB connection error. Please make sure mongoDB is running");
  process.exit();
});
app.set("view engine", "ejs");

app.get("/add-movie", authMiddleware, (req, res) => {
  res.render("add-movie", { errors: {} });
});

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/add-movie", movieController.addMovie);
app.get("/movies", movieController.list);
app.get("/add-movie", (req, res) => {
  res.render("add-movie");
});
app.get("/register", userController.create);
app.post("/register", userController.create);

app.post("/login", userController.login);
app.get("/login", (req, res) => {
  res.render("login-form", { errors: {} });
});

app.get("/movies/delete/:id", movieController.delete);
app.get("/movies/update/:id", movieController.edit);
app.post("/movies/update/:id", movieController.update);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
