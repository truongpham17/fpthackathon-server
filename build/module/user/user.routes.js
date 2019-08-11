'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _express = require('express');

var _user = require('./user.controllers');

var _user2 = require('./user.validations');

var _user3 = _interopRequireDefault(_user2);

var _passport = require('../../service/passport');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.get('/', _passport.authJwt, _user.getUserList);
routes.get('/:id', _passport.authJwt, _user.getUser);
routes.post('/login', (0, _expressValidation2.default)(_user3.default.login), _passport.authLocal);
routes.post('/add', _passport.authJwt, (0, _expressValidation2.default)(_user3.default.createUser), _user.createUser);
routes.patch('/:id', _passport.authJwt, (0, _expressValidation2.default)(_user3.default.editProfile), _user.updateUser);
routes.delete('/:id', _passport.authJwt, _user.deleteUser);

exports.default = routes;