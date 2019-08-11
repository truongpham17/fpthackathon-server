'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _express = require('express');

var _bill = require('./bill.controllers');

var Controllers = _interopRequireWildcard(_bill);

var _bill2 = require('./bill.validations');

var _bill3 = _interopRequireDefault(_bill2);

var _passport = require('../../service/passport');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.get('/', _passport.authJwt, Controllers.getBillList);
routes.get('/return', _passport.authJwt, Controllers.getReturnedBillList);
routes.get('/:id', _passport.authJwt, Controllers.getBillDetail);
routes.post('/', _passport.authJwt, (0, _expressValidation2.default)(_bill3.default.createBill), Controllers.createBill);
routes.post('/return', _passport.authJwt, (0, _expressValidation2.default)(_bill3.default.createReturnedBill), Controllers.returnToSupplier);
routes.patch('/paid/:id', _passport.authJwt, Controllers.paidBill);

exports.default = routes;