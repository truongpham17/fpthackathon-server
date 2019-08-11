'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExportPrice = undefined;

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _product = require('./product.model');

var _product2 = _interopRequireDefault(_product);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const updateExportPrice = exports.updateExportPrice = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    try {
      const product = yield _product2.default.findOne({ _id: req.params.id, isRemoved: false });
      if (!product) {
        throw new Error('Not found');
      }
      // Remove current product and create new one
      product.isRemoved = true;
      yield product.save();
      const newProduct = yield _product2.default.create({
        createdBy: product.createdBy,
        store: product.store,
        importPrice: product.importPrice,
        exportPrice: req.body.exportPrice,
        quantity: product.quantity,
        total: product.total,
        isReturned: product.isReturned,
        isRemoved: false
      });
      return res.status(_httpStatus2.default.OK).json(newProduct);
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function updateExportPrice(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();