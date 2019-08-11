'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _express = require('express');

var _customer = require('./customer.controllers');

var _customer2 = require('./customer.validations');

var _customer3 = _interopRequireDefault(_customer2);

var _passport = require('../../service/passport');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.get('/', _passport.authJwt, _customer.getCustomerList);
routes.get('/:id', _passport.authJwt, _customer.getCustomer);
routes.patch('/addDebt', _passport.authJwt, (0, _expressValidation2.default)(_customer3.default.addDebt), _customer.addCustomerDebt);
// routes.patch('/:id', authJwt, validate(Validations.editStore), StoreControllers.updateStore);
routes.delete('/:id', _passport.authJwt, _customer.deleteCustomer);

exports.default = routes;