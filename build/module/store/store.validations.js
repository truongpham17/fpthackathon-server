'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createStore: {
    body: {
      name: _joi2.default.string().required(),
      totalImportProduct: _joi2.default.number().min(0),
      productQuantity: _joi2.default.number().min(0),
      debt: _joi2.default.number()
    }
  },
  importStore: {
    body: {
      storeId: _joi2.default.string().required(),
      productList: _joi2.default.array().items(_joi2.default.object({
        importPrice: _joi2.default.number().required(),
        exportPrice: _joi2.default.number().required(),
        quantity: _joi2.default.number()
      })),
      note: _joi2.default.string()
    }
  },
  editStore: {
    body: {
      name: _joi2.default.string(),
      totalImportProduct: _joi2.default.number().min(0),
      productQuantity: _joi2.default.number().min(0),
      debt: _joi2.default.number().min(0)
    }
  }
};