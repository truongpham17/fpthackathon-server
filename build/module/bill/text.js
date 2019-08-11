"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

let createBill = exports.createBill = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    try {
      const { productList } = req.body;
      /*
      { product: { importPrice: 23, exportPrice: 23 },
      quantity: 23,
      discount: 0,
      isNew: true }
        { product: [Object], quantity: 23, discount: 0, isNew: true }
      */

      const defaultStore = yield Store.findOne({ isDefault: true });
      let stores = [];
      let products = [];
      for (let i = 0; i < productList.length; i++) {
        let product = {};
        if (productList[i].product.importPrice) {
          product = yield Product.findOne({
            importPrice: productList[i].product.importPrice,
            exportPrice: productList[i].product.exportPrice,
            store: defaultStore._id
          });
          productList[i].product = product._id.toString();
        } else {
          product = yield Product.findOne({
            _id: productList[i].product,
            isRemoved: false
          });
          console.log(productList[i]);
          if (product && product.quantity < productList[i].quantity && !productList[i].isReturned) {
            throw new Error("Het san pham nay roi, huhu");
          }
        }
        if (!product) {
          throw new Error("Invalid product!");
        }

        // create new Product
        const store = yield Store.findById({
          _id: product.store.toString(),
          isRemoved: false
        });

        products.push(product);
        const checkDuplicate = stores.find(function (item) {
          return item._id.toString() === store._id.toString();
        });
        // neu checkduplicate === undefined -> cho add vao
        if (!checkDuplicate) {
          stores.push(store);
        }
      }
      yield Promise.all(productList.map((() => {
        var _ref2 = _asyncToGenerator(function* (item, index) {
          const product = products[index];
          if (!product) {
            throw new Error("Invalid product!");
          }
          const store = stores.find(function (item) {
            return item._id.toString() === product.store.toString();
          });
          if (!store) {
            throw new Error("Invalid Product!");
          }
          // Trả hàng
          if (item.isReturned) {
            // Tìm hàng trả có sẵn
            let returnedProduct = yield Product.findOne({
              importPrice: product.importPrice,
              exportPrice: product.exportPrice,
              isReturned: true,
              isRemoved: false
            });
            if (returnedProduct) {
              returnedProduct.quantity += item.quantity;
              returnedProduct.total += item.quantity;
              yield returnedProduct.save();
            } else {
              returnedProduct = yield Product.createProduct({
                importPrice: product.importPrice,
                exportPrice: product.exportPrice,
                store: product.store,
                quantity: item.quantity,
                total: item.quantity,
                isReturned: true
              }, req.user._id);
            }

            // product.quantity;
            product.total -= item.quantity;
            // await product.save();
            store.productQuantity += item.quantity;
          } else {
            product.quantity -= item.quantity;
            store.productQuantity -= item.quantity;
            // await product.save();
          }

          return null;
          // return await store.save();
        });

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      })()));
      for (let i = 0; i < stores.length; i++) {
        yield stores[i].save();
      }
      for (let i = 0; i < products.length; i++) {
        yield products[i].save();
      }
      const bill = yield Bill.createBill(req.body, req.user._id);
      return res.status(HTTPStatus.CREATED).json(bill);
    } catch (e) {
      console.log(e);
      return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
    }
  });

  return function createBill(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }