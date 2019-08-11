"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require("bcrypt-nodejs");

var _constants = require("../../config/constants");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: [5, "Username must equal or longer than 5"],
    maxlength: [20, "Username must equal or shorter than 20"]
  },
  password: {
    type: String,
    minlength: [6, "Password must equal or longer than 6"]
  },
  fullname: String,
  role: Number,
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

UserSchema.methods = {
  hashPassword(password) {
    return (0, _bcryptNodejs.hashSync)(password);
  },
  validatePassword(password) {
    return (0, _bcryptNodejs.compareSync)(password, this.password);
  },
  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + lifespan);
    return _jsonwebtoken2.default.sign({
      _id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, _constants2.default.JWT_SECRET);
  },
  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      role: this.role,
      active: this.active
    };
  },
  toAuthJSON() {
    return Object.assign({}, this.toJSON(), {
      token: this.generateJWT(_constants2.default.AUTH_TOKEN_LIFESPAN)
    });
  }
};

UserSchema.index({ username: "text" });

exports.default = _mongoose2.default.model("User", UserSchema);