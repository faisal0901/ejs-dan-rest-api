var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOveride = require("method-override");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
mongoose.connect(
  "mongodb+srv://staycation:faisalf0901@cluster0.9gdfz.mongodb.net/db-staycation?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const AdminRouter = require("./routes/admin");
const ApiRouter = require("./routes/api");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000000000 },
  })
);
app.use(cors());
app.use(flash());
app.use(logger("dev"));
app.use(methodOveride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", AdminRouter);
app.use("/api/v1/member", ApiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
