"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteStore = exports.updateStore = exports.importStore = exports.createStore = exports.getStoreHistory = exports.getStoreProducts = exports.getStoreInfo = exports.getStoreList = undefined;

let getStoreList = exports.getStoreList = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    const { isDebt } = req.query;
    try {
      const list = yield _store2.default.list({ skip, limit, isDebt });
      const total = isDebt ? yield _store2.default.count({ isRemoved: false, debt: { $gt: 0 } }) : yield _store2.default.count({ isRemoved: false });
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getStoreList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getStoreInfo = exports.getStoreInfo = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    try {
      const store = yield _store2.default.findOne({ _id: req.params.id, isRemoved: false });
      if (!store) {
        throw new Error("Store not found!");
      }
      // * Calc from bill

      const products = yield _product2.default.find({ store: store._id, isRemoved: false });
      let totalFund = 0;
      // let totalSoldMoneyOld = 0;
      let totalSoldMoney = 0;
      let totalSoldFund = 0;
      let totalSoldProduct = 0;
      let totalReturnedProduct = 0;
      let totalLoiNhuan = 0;
      const bills = yield _bill2.default.find({ isRemoved: false }).populate("productList.product");
      // console.log(bills.productList);
      bills.forEach(function (item) {
        if (!item.isReturned) {
          item.productList.forEach(function (prod) {
            if (prod.product.store.toString() === req.params.id) {
              if (prod.isReturned) {
                totalSoldMoney -= prod.product.exportPrice * prod.quantity;
                totalSoldFund += prod.product.importPrice * prod.quantity;
                totalReturnedProduct += prod.quantity;
                totalSoldProduct -= prod.quantity;
                totalLoiNhuan -= prod.product.exportPrice * prod.quantity - prod.product.importPrice * prod.quantity;
              } else {
                const soldMoney = (prod.product.exportPrice - prod.discount) * prod.quantity;
                const soldFund = prod.product.importPrice * prod.quantity;
                totalSoldMoney += soldMoney;
                totalSoldFund += soldFund;
                totalSoldProduct += prod.quantity;
                totalLoiNhuan += soldMoney - soldFund;
              }
            }
            // loc isReturned = true -$
          });
        }
      });
      products.forEach(function (item) {
        totalFund += item.importPrice * item.total;
      });

      const result = Object.assign({}, (yield store.toJSON()), {
        totalProduct: store.productQuantity,
        totalSoldProduct,
        totalReturnedProduct: store.returnedQuantity,
        totalFund,
        totalSoldMoney,
        totalLoiNhuan
      });
      return res.status(_httpStatus2.default.OK).json(result);
    } catch (e) {
      console.log(e);
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getStoreInfo(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

let getStoreProducts = exports.getStoreProducts = (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    try {
      const store = yield _store2.default.findOne({ _id: req.params.id, isRemoved: false });
      if (!store) {
        throw new Error("Store not found!");
      }
      const list = yield _product2.default.list({ skip, limit, store: store._id });
      const total = yield _product2.default.count({ store: store._id, isRemoved: false });
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getStoreProducts(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

let getStoreHistory = exports.getStoreHistory = (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    try {
      const store = yield _store2.default.findOne({ _id: req.params.id, isRemoved: false });
      if (!store) {
        throw new Error("Store not found!");
      }
      const histories = yield _storeHistory2.default.list({
        skip,
        limit,
        store: store._id
      });
      let totalQuantity = 0;
      let totalPrice = 0;
      histories.forEach(function (item) {
        totalQuantity += item.quantity;
        let price = 0;
        item.productList.forEach(function (pd) {
          price = pd.product.importPrice * pd.quantity;
        });
        totalPrice += price;
      });
      const total = yield _storeHistory2.default.count({
        store: store._id,
        isRemoved: false
      });
      return res.status(_httpStatus2.default.OK).json({ list: histories, totalQuantity, totalPrice, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getStoreHistory(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})();

let createStore = exports.createStore = (() => {
  var _ref5 = _asyncToGenerator(function* (req, res) {
    try {
      const store = yield _store2.default.createStore(req.body, req.user._id);
      return res.status(_httpStatus2.default.CREATED).json(store);
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function createStore(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
})();

let importStore = exports.importStore = (() => {
  var _ref6 = _asyncToGenerator(function* (req, res) {
    try {
      const { storeId, productList, note, shoudSaveAsHistory, debt } = req.body;
      const store = yield _store2.default.findById(storeId);
      if (!store) {
        throw new Error("Store not found!");
      }

      let countTotal = 0;
      let countTotalImport = 0;
      let totalPrice = 0;

      const products = yield Promise.all(productList.map((() => {
        var _ref7 = _asyncToGenerator(function* ({ importPrice, exportPrice, quantity = 0 }) {
          countTotalImport += quantity;
          totalPrice += importPrice * quantity;
          const product = yield _product2.default.findOne({
            store: store._id,
            importPrice,
            exportPrice,
            isRemoved: false
          });
          if (product) {
            product.quantity += quantity;
            product.total += quantity;
            // countQuantity += product.quantity;
            countTotal += product.total;
            return {
              product: yield product.save(),
              quantity
            };
          } else {
            // countQuantity += quantity;
            countTotal += quantity;
            return {
              product: yield _product2.default.createProduct({
                importPrice,
                exportPrice,
                quantity,
                total: quantity,
                store: store._id
              }, req.user._id),
              quantity
            };
          }
        });

        return function (_x13) {
          return _ref7.apply(this, arguments);
        };
      })()));
      store.totalImportProduct += countTotalImport;
      store.productQuantity += countTotalImport;
      store.debt += totalPrice;

      if (shoudSaveAsHistory) {
        const result = yield _storeHistory2.default.createStoreHistory({
          store: store._id.toString(),
          quantity: countTotalImport,
          total: countTotal,
          note,
          totalPrice,
          productList: products.map(function (item) {
            return {
              product: item.product._id,
              quantity: item.quantity
            };
          })
        }, req.user._id);
      }

      return res.status(_httpStatus2.default.OK).json((yield store.save()));
    } catch (e) {
      console.log(e);
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function importStore(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
})();

let updateStore = exports.updateStore = (() => {
  var _ref8 = _asyncToGenerator(function* (req, res) {
    try {
      const store = yield _store2.default.findOne({ _id: req.params.id, isRemoved: false });
      if (!store) {
        throw new Error("Store not found!");
      }

      Object.keys(req.body).forEach(function (key) {
        store[key] = req.body[key];
      });

      return res.status(_httpStatus2.default.OK).json((yield store.save()));
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function updateStore(_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
})();

let deleteStore = exports.deleteStore = (() => {
  var _ref9 = _asyncToGenerator(function* (req, res) {
    try {
      const store = yield _store2.default.findOne({ _id: req.params.id, isRemoved: false });
      if (!store) {
        return res.sendStatus(_httpStatus2.default.NOT_FOUND);
      }

      store.isRemoved = true;

      return res.status(_httpStatus2.default.OK).json((yield store.save()));
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function deleteStore(_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
})();

var _httpStatus = require("http-status");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _store = require("./store.model");

var _store2 = _interopRequireDefault(_store);

var _product = require("../product/product.model");

var _product2 = _interopRequireDefault(_product);

var _bill = require("../bill/bill.model");

var _bill2 = _interopRequireDefault(_bill);

var _storeHistory = require("./storeHistory.model");

var _storeHistory2 = _interopRequireDefault(_storeHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }