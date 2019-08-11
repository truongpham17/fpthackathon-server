"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUserList = undefined;

var _httpStatus = require("http-status");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _user = require("./user.model");

var _user2 = _interopRequireDefault(_user);

var _constants = require("../../config/constants");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getUserList = exports.getUserList = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const search = req.query.search;
    try {
      let list;
      const queries = !search ? {} : { $text: { $search: search } };
      if (search) {
        list = yield _user2.default.find(queries, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).skip(skip).limit(limit);
      } else {
        list = yield _user2.default.find(queries).sort({ name: 1 }).skip(skip).limit(limit);
      }
      const total = yield _user2.default.count(queries);
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (error) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(error.message || e);
    }
  });

  return function getUserList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const getUser = exports.getUser = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    try {
      const user = yield _user2.default.findOne({ _id: req.params.id });
      return res.status(_httpStatus2.default.OK).json(user.toJSON());
    } catch (error) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(error.message || e);
    }
  });

  return function getUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const createUser = exports.createUser = (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    try {
      const { username } = req.body;
      if (!username || username.length <= 5) {
        throw new Error("Min length is 6");
      }
      const checkDuplicate = yield _user2.default.findOne({ username: req.body.username });
      if (checkDuplicate) {
        throw new Error("Duplicate user!");
      }
      const user = yield _user2.default.create(req.body);
      return res.status(_httpStatus2.default.CREATED).json(user.toJSON());
    } catch (error) {
      console.log(error);
      return res.status(_httpStatus2.default.BAD_REQUEST).json(error.message || e);
    }
  });

  return function createUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

const updateUser = exports.updateUser = (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    try {
      const user = yield _user2.default.findOne({ _id: req.params.id });
      console.log(user);
      if (!user) {
        throw new Error("Not found");
      }
      Object.keys(req.body).forEach(function (key) {
        user[key] = req.body[key];
      });
      yield user.save();
      return res.status(_httpStatus2.default.OK).json(user.toJSON());
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function updateUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})();

const deleteUser = exports.deleteUser = (() => {
  var _ref5 = _asyncToGenerator(function* (req, res) {
    try {
      const user = yield _user2.default.findOneAndRemove({ _id: req.params.id });
      if (!user) {
        throw new Error("Not found");
      }

      return res.status(_httpStatus2.default.OK).json(user.toJSON());
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function deleteUser(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
})();