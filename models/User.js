let mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

let UserSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      default: "",
      trim: true,
      required: "username is required",
      unique: 1,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      required: "email address is required",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    update: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
  },
  {
    collection: "users",
  }
);

UserSchema.method("comparePassword", (plainPassword, cb) => {
  password = "";
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(plainPassword, salt, function (err, hash) {
      if (err) return next(err);
      password = hash;
    });
  });
  console.log(this.password);
  console.log(password);
  if (this.password === password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
});

UserSchema.methods.generateToken = function () {
  // let user = this;
  const token = jwt.sign(this._id.toHexString(), "secretToken");
  this.token = token;
  return this.save()
    .then((user) => user)
    .catch((err) => err);
};

UserSchema.statics.findByToken = function (token) {
  let user = this;
  //secretToken을 통해 user의 id값을 받아오고 해당 아이디를 통해
  //Db에 접근해서 유저의 정보를 가져온다
  return jwt.verify(token, "secretToken", function (err, decoded) {
    return user
      .findOne({ _id: decoded, token: token })
      .then((user) => user)
      .catch((err) => err);
  });
};

const model = mongoose.model("User", UserSchema);

module.exports = model;
