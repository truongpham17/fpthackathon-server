"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCustomer = exports.addCustomerDebt = exports.getCustomer = exports.getCustomerList = undefined;

var _httpStatus = require("http-status");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _customer = require("./customer.model");

var _customer2 = _interopRequireDefault(_customer);

var _constants = require("../../config/constants");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getCustomerList = exports.getCustomerList = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const search = req.query.search;
    const isDebt = req.query.isDebt;
    console.log(search);
    try {
      let list;
      let queries;
      if (isDebt) {
        queries = { debt: { $gt: 0 } };
      } else {
        queries = !search ? {} : { $text: { $search: search } };
      }
      if (search && search.length > 0) {
        list = yield _customer2.default.find(queries, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).skip(skip).limit(limit);
      } else {
        list = yield _customer2.default.find(queries).sort({ name: 1 }).skip(skip).limit(limit);
      }
      const total = yield _customer2.default.count(queries);
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (error) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(error.message || e);
    }
  });

  return function getCustomerList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const getCustomer = exports.getCustomer = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    try {
      const customer = yield _customer2.default.findOne({ _id: req.params.id });
      return res.status(_httpStatus2.default.OK).json(customer.toJSON());
    } catch (error) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(error.message || e);
    }
  });

  return function getCustomer(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const addCustomerDebt = exports.addCustomerDebt = (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    try {

      // find customer
      const customer = yield _customer2.default.findOne({ _id: req.body.id });
      // if customer not exist -> create new customer and add debt
      if (!customer) {
        const result = yield _customer2.default.create(req.body);
        return res.status(_httpStatus2.default.CREATED).json(result.toJSON());
      }

      // if customer already exist
      customer.debt = req.body.debt >= 0 ? req.body.debt : 0;
      customer.username = req.body.username || customer.username;
      customer.phone = req.body.phone || customer.phone;
      customer.address = req.body.address || customer.address;

      yield customer.save();
      return res.status(_httpStatus2.default.CREATED).json(customer.toJSON());
    } catch (error) {
      console.log(error);
      return res.status(_httpStatus2.default.BAD_REQUEST).json(error.message || e);
    }
  });

  return function addCustomerDebt(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

const deleteCustomer = exports.deleteCustomer = (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    try {
      const customer = yield _customer2.default.findOneAndRemove({ _id: req.params.id });
      if (!customer) {
        throw new Error("Not found");
      }

      return res.status(_httpStatus2.default.OK).json(customer.toJSON());
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function deleteCustomer(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})();