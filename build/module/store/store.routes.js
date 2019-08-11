'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _express = require('express');

var _store = require('./store.controllers');

var StoreControllers = _interopRequireWildcard(_store);

var _store2 = require('./store.validations');

var _store3 = _interopRequireDefault(_store2);

var _passport = require('../../service/passport');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.get('/', _passport.authJwt, StoreControllers.getStoreList);
routes.get('/:id', _passport.authJwt, StoreControllers.getStoreInfo);
routes.get('/:id/products', _passport.authJwt, StoreControllers.getStoreProducts);
routes.get('/:id/history', _passport.authJwt, StoreControllers.getStoreHistory);
routes.post('/', _passport.authJwt, (0, _expressValidation2.default)(_store3.default.createStore), StoreControllers.createStore);
routes.post('/import', _passport.authJwt, (0, _expressValidation2.default)(_store3.default.importStore), StoreControllers.importStore);
routes.patch('/:id', _passport.authJwt, (0, _expressValidation2.default)(_store3.default.editStore), StoreControllers.updateStore);
routes.delete('/:id', _passport.authJwt, StoreControllers.deleteStore);

exports.default = routes;