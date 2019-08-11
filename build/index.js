'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _constants = require('./config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _middlewares = require('./config/middlewares');

var _middlewares2 = _interopRequireDefault(_middlewares);

require('./config/database');

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

(0, _middlewares2.default)(app);

(0, _module2.default)(app);

app.listen(_constants2.default.PORT, () => {
  console.log(`
      PORT:       ${_constants2.default.PORT}
      ENV:        ${process.env.NODE_ENV}`);
});

process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});