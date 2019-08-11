import HTTPStatus from "http-status";
import Store from "./store.model";
import Product from "../product/product.model";
import Bill from "../bill/bill.model";
import StoreHistory from "./storeHistory.model";

export async function getStoreList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const { isDebt } = req.query;
  try {
    const list = await Store.list({ skip, limit , isDebt});
    const total = isDebt ? await Store.count({isRemoved: false, debt: {$gt: 0}}) : await Store.count({ isRemoved: false });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getStoreInfo(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error("Store not found!");
    }
    // * Calc from bill

    const products = await Product.find({ store: store._id, isRemoved: false });
    let totalFund = 0;
    // let totalSoldMoneyOld = 0;
    let totalSoldMoney = 0;
    let totalSoldFund = 0;
    let totalSoldProduct = 0;
    let totalReturnedProduct = 0;
    let totalLoiNhuan = 0;
    const bills = await Bill.find({ isRemoved: false }).populate(
      "productList.product"
    );
    // console.log(bills.productList);
    bills.forEach(item => {
      if (!item.isReturned) {
        item.productList.forEach(prod => {
          if (prod.product.store.toString() === req.params.id) {
            if (prod.isReturned) {
              totalSoldMoney -= prod.product.exportPrice * prod.quantity;
              totalSoldFund += prod.product.importPrice * prod.quantity;
              totalReturnedProduct += prod.quantity;
              totalSoldProduct -= prod.quantity;
              totalLoiNhuan -=
                prod.product.exportPrice * prod.quantity -
                prod.product.importPrice * prod.quantity;
            } else {
              const soldMoney =
                (prod.product.exportPrice - prod.discount) * prod.quantity;
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
    products.forEach(item => {
      totalFund += item.importPrice * item.total;
    });

    const result = {
      ...(await store.toJSON()),
      totalProduct: store.productQuantity,
      totalSoldProduct,
      totalReturnedProduct: store.returnedQuantity,
      totalFund,
      totalSoldMoney,
      totalLoiNhuan
    };
    return res.status(HTTPStatus.OK).json(result);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getStoreProducts(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error("Store not found!");
    }
    const list = await Product.list({ skip, limit, store: store._id });
    const total = await Product.count({ store: store._id, isRemoved: false });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getStoreHistory(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error("Store not found!");
    }
    const histories = await StoreHistory.list({
      skip,
      limit,
      store: store._id
    });
    let totalQuantity = 0;
    let totalPrice = 0;
    histories.forEach(item => {
      totalQuantity += item.quantity;
      let price = 0;
      item.productList.forEach(pd => {
        price = pd.product.importPrice * pd.quantity;
      });
      totalPrice += price;
    });
    const total = await StoreHistory.count({
      store: store._id,
      isRemoved: false
    });
    return res
      .status(HTTPStatus.OK)
      .json({ list: histories, totalQuantity, totalPrice, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function createStore(req, res) {
  try {
    const store = await Store.createStore(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(store);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}


export async function importStore(req, res) {
  try {
    const { storeId, productList, note, shoudSaveAsHistory, debt } = req.body;
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error("Store not found!");
    }

    let countTotal = 0;
    let countTotalImport = 0;
    let totalPrice = 0;

    const products = await Promise.all(
      productList.map(async ({ importPrice, exportPrice, quantity = 0 }) => {
        countTotalImport += quantity;
        totalPrice += importPrice * quantity;
        const product = await Product.findOne({
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
            product: await product.save(),
            quantity
          };
        } else {
          // countQuantity += quantity;
          countTotal += quantity;
          return {
            product: await Product.createProduct(
              {
                importPrice,
                exportPrice,
                quantity,
                total: quantity,
                store: store._id
              },
              req.user._id
            ),
            quantity
          };
        }
      })
    );
    store.totalImportProduct += countTotalImport;
    store.productQuantity += countTotalImport;
    store.debt += totalPrice;

    if (shoudSaveAsHistory) {
      const result = await StoreHistory.createStoreHistory(
        {
          store: store._id.toString(),
          quantity: countTotalImport,
          total: countTotal,
          note,
          totalPrice,
          productList: products.map(item => ({
            product: item.product._id,
            quantity: item.quantity
          }))
        },
        req.user._id
      );
    }

    return res
      .status(HTTPStatus.OK)
      .json(await store.save());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function updateStore(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error("Store not found!");
    }

    Object.keys(req.body).forEach(key => {
      store[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await store.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function deleteStore(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    store.isRemoved = true;

    return res.status(HTTPStatus.OK).json(await store.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}
