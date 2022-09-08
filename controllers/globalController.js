const req = require("express/lib/request");
const res = require("express/lib/response");
const Temp = require("../models/Temp");
const User = require("../models/User");
exports.home = (req, res) => {
  if (req.query.id) {
    res.render("login_home");
  } else {
    res.render("home");
  }
}; //  global router의 12번라인 globalRouter.get(routes.home, home); 돌 때 이 함수 실행해서 home.pug 렌더링
exports.getSubmit = (req, res) => res.render("submit");
exports.postSubmit = async (req, res) => {
  if (req.body.temperature >= 37) {
    // 체온이 37도 이상일때

    res.render("up"); // 출입 불가를 알리는 텍스트가 담겨진 up.pug를 렌더링
  } else {
    const temp = await Temp.create({
      // 유저 생성
      name: req.body.name,
      phone: req.body.phone,
      temperature: req.body.temperature,
    });
    res.render("down"); // 출입 가능을 알리는 텍스트가 담겨진 down.pug를 렌더링
  }
};
exports.getView = async (req, res) => {
  const data = await Temp.find({}); // 저장된 전체 유저 조회
  res.json({ data }); // json 형식으로 위 유저 정보 응답
};

exports.getLogin = (req, res) => res.render("login");
exports.postLogin = (req, res) => {
  User.findOne({ userName: req.body.userName }, async (err, user) => {
    if (err) {
      console.log(err);
      return res.json({
        loginSuccess: false,
        message: "존재하지 않는 아이디입니다.",
      });
    }
    if (req.body.password == user.password) {
      user
        .generateToken()
        .then((user) => {
          res
            .cookie("x_auth", user.token)
            .status(200)
            // .json({ loginSuccess: true, userId: user._id })
            .redirect("/?id=" + req.body.userName);
        })
        .catch((err) => {
          res.status(400).send(err);
        })
        .catch((err) => {
          res.json({ loginSuccess: false, err });
          console.log(err);
        });
    } else {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });
};

exports.postLogout = (req, res) => {
  User.findOneAndUpdate({ name: req.query.id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    res.clearCookie("x_auth");
    return res.status(200).redirect("/");
  });
};

exports.getRegister = (req, res) => res.render("register");
exports.postRegister = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // email을 비교하여 user가 이미 존재하는지 확인

    var user = await User.findOne({ userName });
    console.log(user);
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // user에 name, email, password 값 할당
    user = new User({
      userName,
      email,
      password,
    });

    // password를 암호화 하기
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    await user.save(); // db에 user 저장
    res.redirect("/login");
    // res.send("Success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
