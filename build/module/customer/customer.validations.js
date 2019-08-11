"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  addDebt: {
    body: {
      id: _joi2.default.string(),
      username: _joi2.default.string().min(2).max(40),
      phone: _joi2.default.string(),
      address: _joi2.default.string(),
      debt: _joi2.default.number().required().min(0)
    }
  }
};