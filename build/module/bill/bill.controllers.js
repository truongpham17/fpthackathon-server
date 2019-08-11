"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paidBill = exports.returnToSupplier = exports.getBillDetail = exports.createBill = exports.getReturnedBillList = exports.getBillList = undefined;

let getBillList = exports.getBillList = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    const search = req.query.search;
    const customer = req.query.customer;
    try {
      console.log(customer);
      let list = yield _bill2.default.list({ skip, limit, search });
      console.log(list);
      let total = yield _bill2.default.count({
        isRemoved: false,
        isReturned: false,
        _id: new RegExp(search, "i")
      });

      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getBillList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getReturnedBillList = exports.getReturnedBillList = (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    try {
      const list = yield _bill2.default.list({ skip, limit, isReturned: true });
      const total = yield _bill2.default.count({ isRemoved: false, isReturned: true });
      return res.status(_httpStatus2.default.OK).json({ list, total });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getReturnedBillList(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

// productList:
// product: { quantity: number, exportPrice: number, store: { storeName: string, storeId: string }, importPrice: number }
// only need importPrice when this product is in defaultStore
// customer: {isNew: boolean} || {id: string}

let createBill = exports.createBill = (() => {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    try {
      const { productList, customer, paidMoney, note } = req.body;
      let totalQuantity = 0;
      let totalPrice = 0;
      let totalPaid = 0;
      let saveList = [];
      // console.log("paid money is: ", paidMoney)
      console.log(req.body);

      // console.log(req.body);
      const defaultStore = yield _store2.default.findOne({ isDefault: true });
      const productProcess = [];

      // add field customer for bill
      // if new customer -> create one
      let dbCustomer = null;
      if (customer.id || customer.isNew) {
        if (customer.isNew) {
          // add new Customer
          dbCustomer = yield _customer2.default.createCustomer(customer);
        } else {
          dbCustomer = yield _customer2.default.findById({ _id: customer.id });
        }
        console.log('customer', dbCustomer);
        if (!dbCustomer) {
          throw new Error("Invalid customer!");
        }
      }

      for (let i = 0; i < productList.length; i++) {
        const productItem = productList[i];

        let store = yield _store2.default.findById({ _id: productItem.store.storeId });
        // if(!store) {
        //   store = defaultStore;
        // }

        let productDB = yield _product2.default.findOne({
          exportPrice: productItem.exportPrice,
          store: productItem.store.storeId
        });

        // neu khong tim duoc san pham, create new
        if (!productDB) {
          // ban hang
          if (!productItem.isReturned) {
            console.log("ban hang - khong ton tai hang");
            productDB = yield _product2.default.createProduct({
              importPrice: productItem.exportPrice - 20,
              exportPrice: productItem.exportPrice,
              quantity: 0,
              total: productItem.quantity,
              store: productItem.store.storeId
            });
            store.totalImportProduct += productItem.quantity;
            yield store.save();
          } else {
            // tra hang
            console.log("tra hang - khong ton tai hang");
            productDB = yield _product2.default.createProduct({
              importPrice: productItem.exportPrice - 20,
              exportPrice: productItem.exportPrice,
              quantity: productItem.quantity,
              total: productItem.quantity,
              store: productItem.store.storeId
            });
            store.totalImportProduct += productItem.quantity;
            store.productQuantity += productItem.quantity;
            yield store.save();
          }
        } else {
          // ton tai product
          // ban hang
          if (!productItem.isReturned) {
            const delta = productDB.quantity - productItem.quantity;
            // con hang
            if (delta >= 0) {
              console.log("co san pham - ban hang - con hang");
              productDB.quantity -= productItem.quantity;
              store.productQuantity -= productItem.quantity;
              yield store.save();
              yield productDB.save();
            } else {
              // khong con hang
              console.log("co san pham - ban hang - thieu hang");
              store.productQuantity -= productDB.quantity;
              store.totalImportProduct -= delta;
              productDB.quantity = 0;
              productDB.total -= delta;
              yield store.save();
              productDB.save();
            }
          } else {
            // tra hang
            const delta = productDB.total - productDB.quantity - productItem.quantity;
            //du so luong
            if (delta >= 0) {
              console.log(" co san pham - tra hang - du hang");
              productDB.quantity += productItem.quantity;
              store.productQuantity += productItem.quantity;
              yield productDB.save();
              yield store.save();
            } else {
              // khong du so luong
              console.log(" co san pham - tra hang - khong du hang");
              productDB.quantity += productItem.quantity;
              productDB.total -= delta;
              store.productQuantity += productItem.quantity;
              store.totalImportProduct -= delta;
              yield productDB.save();
              yield store.save();
            }
          }
        }
        productProcess.push(productDB);
        totalQuantity += productItem.quantity * (productItem.isReturned ? -1 : 1);
        totalPrice += productItem.quantity * (productItem.exportPrice - (productItem.discount || 0)) * (productItem.isReturned ? -1 : 1);
        saveList.push({
          product: productDB,
          quantity: productItem.quantity,
          discount: productItem.discount || 0,
          isReturned: productItem.isReturned
        });
      }

      let currentDebt = 0;
      if (dbCustomer) {
        currentDebt = dbCustomer.debt;
      }
      console.log("total price: ", totalPrice);
      console.log("paid money: " + paidMoney);
      console.log("customer debt: " + customer.debt);
      if (dbCustomer) {
        dbCustomer.debt = totalPrice - paidMoney + dbCustomer.debt;
        yield dbCustomer.save();
      }

      const bill = yield _bill2.default.createBill({ customer: dbCustomer && dbCustomer._id, totalQuantity, totalPrice, totalPaid: paidMoney, note, productList: saveList, currentDebt }, req.user._id);
      return res.status(_httpStatus2.default.CREATED).json(bill);
    } catch (err) {
      console.log(err);
      return res.status(_httpStatus2.default.BAD_REQUEST).json(err.message || e);
    }
  });

  return function createBill(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

let getBillDetail = exports.getBillDetail = (() => {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    try {
      const bill = yield _bill2.default.findOne({
        _id: req.params.id,
        isRemoved: false
      }).populate({
        path: "productList.product createdBy customer",
        populate: {
          path: "store"
        }
      });
      if (!bill) {
        return res.sendStatus(_httpStatus2.default.NOT_FOUND);
      }
      return res.status(_httpStatus2.default.OK).json((yield bill.toDetailJSON()));
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function getBillDetail(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})();

// productList: {product, quantity}

let returnToSupplier = exports.returnToSupplier = (() => {
  var _ref5 = _asyncToGenerator(function* (req, res) {
    try {
      const _req$body = req.body,
            { productList, totalPrice, totalQuantity } = _req$body,
            rest = _objectWithoutProperties(_req$body, ["productList", "totalPrice", "totalQuantity"]);
      console.log(req.body);
      let productInDb = [];
      let store;
      for (let i = 0; i <= productList.length - 1; i++) {
        const item = productList[i];
        const product = yield _product2.default.findOne({
          _id: item.product,
          isRemoved: false
        });
        if (!product) {
          throw new Error("Invalid product!");
        }
        productInDb.push({ product, quantity: item.quantity });
        if (!store) {
          store = yield _store2.default.findById({
            _id: product.store,
            isRemoved: false
          });
        }
        let delta = item.quantity;
        if (product.quantity < item.quantity) {
          store.productQuantity -= product.quantity;
          store.getReturnedBillList += item.quantity;
          store.totalImportProduct -= product.quantity;
          product.total -= product.quantity;
          product.quantity = 0;
        } else {
          store.productQuantity -= item.quantity;
          store.returnedQuantity += item.quantity;
          store.totalImportProduct -= item.quantity;
          product.quantity -= item.quantity;
          product.total -= item.quantity;
        }

        yield product.save();
      }

      store.debt -= totalPrice;
      yield store.save();

      //  const bill = await Bill.createBill({ customer: dbCustomer && dbCustomer._id, totalQuantity, totalPrice, totalPaid, note, productList: saveList}, req.user._id);

      const a = productInDb.map(function (item) {
        return {
          product: item.product,
          quantity: item.quantity,
          discount: 0,
          isReturned: true
        };
      });
      console.log('result product List: ', a);
      const bill = yield _bill2.default.createBill({
        productList: productInDb.map(function (item) {
          return {
            product: item.product,
            quantity: item.quantity,
            discount: 0,
            isReturned: true
          };
        }),
        isReturned: true,
        totalQuantity,
        totalPrice,
        totalPaid: totalPrice,
        note: ''
      }, req.user._id);
      return res.status(_httpStatus2.default.CREATED).json(bill);
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function returnToSupplier(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
})();

let paidBill = exports.paidBill = (() => {
  var _ref6 = _asyncToGenerator(function* (req, res) {
    try {
      const bill = yield _bill2.default.findOne({
        _id: req.params.id,
        isRemoved: false
      }).populate({
        path: "productList.product",
        populate: {
          path: "store"
        }
      });
      if (!bill) {
        return res.sendStatus(_httpStatus2.default.NOT_FOUND);
      }
      if (bill.totalPaid >= bill.totalPrice) {
        return res.status(_httpStatus2.default.OK).json({ message: "Bill've already paid!" });
      }
      bill.totalPaid = bill.totalPrice;
      bill.paymentStatus = "paid";
      yield bill.save();
      return res.status(_httpStatus2.default.OK).json({ message: "Paid success!" });
    } catch (e) {
      return res.status(_httpStatus2.default.BAD_REQUEST).json(e.message || e);
    }
  });

  return function paidBill(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
})();

var _httpStatus = require("http-status");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _bill = require("./bill.model");

var _bill2 = _interopRequireDefault(_bill);

var _store = require("../store/store.model");

var _store2 = _interopRequireDefault(_store);

var _product = require("../product/product.model");

var _product2 = _interopRequireDefault(_product);

var _customer = require("../customer/customer.model");

var _customer2 = _interopRequireDefault(_customer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }