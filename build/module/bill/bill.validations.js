'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createBill: {
    body: {
      productList: _joi2.default.array().items(_joi2.default.object({
        // product: Joi.string().required(),
        quantity: _joi2.default.number().required(),
        discount: _joi2.default.number(),
        isReturned: _joi2.default.boolean()
      })).min(1).required(),
      customer: _joi2.default.object().keys({
        username: _joi2.default.string().allow(''),
        phone: _joi2.default.string().allow(''),
        address: _joi2.default.string().allow(''),
        isNew: _joi2.default.boolean().allow('')
      }),
      note: _joi2.default.string().allow('')
      // totalQuantity: Joi.number().required(),
      // totalPrice: Joi.number().required(),
      // otherCost: Joi.number().allow(null),
      // totalPaid: Joi.number().required(),
    }
  },
  createReturnedBill: {
    body: {
      productList: _joi2.default.array().items(_joi2.default.object({
        product: _joi2.default.string().required(),
        quantity: _joi2.default.number().required(),
        discount: _joi2.default.number(),
        isReturned: _joi2.default.boolean()
      })).min(1).required(),
      customer: _joi2.default.object().keys({
        name: _joi2.default.string().allow(''),
        phone: _joi2.default.string().allow(''),
        address: _joi2.default.string().allow('')
      }),
      note: _joi2.default.string().allow(''),
      totalQuantity: _joi2.default.number().required(),
      totalPrice: _joi2.default.number().required(),
      otherCost: _joi2.default.number().allow(null),
      totalPaid: _joi2.default.number().allow(null)
    }
  },
  editBill: {
    body: {
      productList: _joi2.default.array().items(_joi2.default.object({
        product: _joi2.default.string().required(),
        quantity: _joi2.default.number().required(),
        discount: _joi2.default.number(),
        isReturned: _joi2.default.boolean()
      })).min(1),
      customer: _joi2.default.object().keys({
        name: _joi2.default.string(),
        phone: _joi2.default.string(),
        address: _joi2.default.string()
      }),
      note: _joi2.default.string(),
      totalQuantity: _joi2.default.number(),
      totalPrice: _joi2.default.number(),
      otherCost: _joi2.default.number(),
      totalPaid: _joi2.default.number()
    }
  }
};