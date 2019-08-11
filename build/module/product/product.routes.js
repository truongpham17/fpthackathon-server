'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _express = require('express');

var _product = require('./product.controllers');

var _product2 = require('./product.validations');

var _product3 = _interopRequireDefault(_product2);

var _passport = require('../../service/passport');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.patch('/:id', _passport.authJwt, (0, _expressValidation2.default)(_product3.default.updateExportPrice), _product.updateExportPrice);

exports.default = routes;