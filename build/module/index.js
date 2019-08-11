'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('./user/user.routes');

var _user2 = _interopRequireDefault(_user);

var _store = require('./store/store.routes');

var _store2 = _interopRequireDefault(_store);

var _bill = require('./bill/bill.routes');

var _bill2 = _interopRequireDefault(_bill);

var _report = require('./report/report.routes');

var _report2 = _interopRequireDefault(_report);

var _product = require('./product/product.routes');

var _product2 = _interopRequireDefault(_product);

var _customer = require('./customer/customer.routes');

var _customer2 = _interopRequireDefault(_customer);

var _test = require('./test/test.routes');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = app => {
  app.use('/user', _user2.default);
  app.use('/store', _store2.default);
  app.use('/bill', _bill2.default);
  app.use('/report', _report2.default);
  app.use('/product', _product2.default);
  app.use('/customer', _customer2.default);
  app.use('/test', _test2.default);
};