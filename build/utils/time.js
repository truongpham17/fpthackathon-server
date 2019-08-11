'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDaysInRange = exports.getMonthsInRange = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getMonthsInRange = exports.getMonthsInRange = (start, end) => {
  const result = [];
  let curr = (0, _moment2.default)(start);
  while ((0, _moment2.default)(curr).isSameOrBefore((0, _moment2.default)(end))) {
    result.push((0, _moment2.default)(curr).format('MM/YYYY'));
    curr.add(1, 'month');
  }
  return result;
};

const getDaysInRange = exports.getDaysInRange = (start, end) => {
  const result = [];
  let curr = (0, _moment2.default)(start);
  while ((0, _moment2.default)(curr).isSameOrBefore((0, _moment2.default)(end))) {
    result.push((0, _moment2.default)(curr).format('DD/MM/YYYY'));
    curr.add(1, 'day');
  }
  return result;
};