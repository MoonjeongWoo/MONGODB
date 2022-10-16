const express = require("express");
const routes = require("../routes");
const {
  home,
  getSubmit,
  postSubmit,
  getView,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  postLogout,
} = require("../controllers/globalController");

const globalRouter = express.Router();

globalRouter.get(routes.home, home); // routes.js에 선언되어있는 home ('/')으로의 요청이 있을시 globalController에 있는 home 실행

globalRouter.get(routes.submit, getSubmit);
globalRouter.post(routes.submit, postSubmit);

globalRouter.get(routes.view, getView);

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.register, getRegister);
globalRouter.post(routes.register, postRegister);

globalRouter.post(routes.logout, postLogout);

module.exports = globalRouter;
