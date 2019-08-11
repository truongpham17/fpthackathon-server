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

const CustomerSchema = new _mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [2, "Username must equal or longer than 2"],
    maxlength: [40, "Username must equal or shorter than 20"]
  },
  phone: String,
  address: String,
  debt: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

CustomerSchema.methods = {
  toJSON() {
    return {
      username: this.username,
      phone: this.phone,
      address: this.address,
      debt: this.debt,
      id: this._id.toString()
    };
  }
};

CustomerSchema.statics = {
  createCustomer(args) {
    return this.create(Object.assign({}, args));
  }
};

CustomerSchema.index({ username: 'text' });

exports.default = _mongoose2.default.model("Customer", CustomerSchema);