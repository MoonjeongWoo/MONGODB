const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan"); // 로그
const helmet = require("helmet"); // 기초 보안 설정
const cookieParser = require("cookie-parser"); // 쿠키를 다룰 수 있음. 여기선 안씀
const bodyParser = require("body-parser"); // form데이터를 서버로 받아와서 활용가능하게 해줌
const mongoose = require("mongoose");
const { localsMiddleware } = require("./middlewares");
const routes = require("./routes");
const globalRouter = require("./routers/globalRouter");

const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // 인수로 dev외에 combined, common, short, tiny 등을 넣을 수 있다.인수를 바꾸면 로그가 달라진다. 대체로 개발환경에서는 dev, 배포 환경에서는 combined를 사용.
app.use(localsMiddleware);

app.use(routes.home, globalRouter);
//
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
