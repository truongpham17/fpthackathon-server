'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authJwt = exports.authLocal = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = require('passport-jwt');

var _constants = require('../config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _user = require('../module/user/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const localOpts = {
  usernameField: 'username'
};
const localStrategy = new _passportLocal2.default(localOpts, (() => {
  var _ref = _asyncToGenerator(function* (username, password, done) {
    try {
      const user = yield _user2.default.findOne({ username });

      if (!user) {
        return done(null, false);
      } else if (!user.validatePassword(password)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})());

_passport2.default.use(localStrategy);

const authLocal = exports.authLocal = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res, next) {
    return _passport2.default.authenticate('local', { session: false }, function (err, user) {
      if (err) {
        return res.status(_httpStatus2.default.UNAUTHORIZED).json('Invalid username or password');
      }
      if (!user) {
        return res.status(_httpStatus2.default.UNAUTHORIZED).json('Invalid username or password');
      }

      return res.status(_httpStatus2.default.OK).json(user.toAuthJSON());
    })(req, res, next);
  });

  return function authLocal(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
})();

const jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromExtractors([_passportJwt.ExtractJwt.fromHeader('token'), req => req.params.token]),
  secretOrKey: _constants2.default.JWT_SECRET
};

const jwtStrategy = new _passportJwt.Strategy(jwtOpts, (() => {
  var _ref3 = _asyncToGenerator(function* (payload, done) {
    try {
      const user = yield _user2.default.findOne({ _id: payload._id });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  });

  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
})());

_passport2.default.use(jwtStrategy);

const authJwt = exports.authJwt = _passport2.default.authenticate('jwt', { session: false });