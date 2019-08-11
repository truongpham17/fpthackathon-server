export async function createBill(req, res) {
  try {
    const { productList } = req.body;
    /*
    { product: { importPrice: 23, exportPrice: 23 },
    quantity: 23,
    discount: 0,
    isNew: true }


    { product: [Object], quantity: 23, discount: 0, isNew: true }
    */


    const defaultStore = await Store.findOne({isDefault: true});
    let stores = [];
    let products = [];
    for (let i = 0; i < productList.length; i++) {
      let product = {};
      if(productList[i].product.importPrice) {
        product = await Product.findOne({
          importPrice: productList[i].product.importPrice,
          exportPrice: productList[i].product.exportPrice,
          store: defaultStore._id
        })
        productList[i].product = product._id.toString();
      } else {
        product = await Product.findOne({
          _id: productList[i].product,
          isRemoved: false
        });
        console.log(productList[i]);
        if(product && product.quantity < productList[i].quantity && !productList[i].isReturned) {
          throw new Error("Het san pham nay roi, huhu");
        }
      }
      if (!product) {
        throw new Error("Invalid product!");
      }


        // create new Product
      const store = await Store.findById({
        _id: product.store.toString(),
        isRemoved: false
      });

      products.push(product);
      const checkDuplicate = stores.find(
        item => item._id.toString() === store._id.toString()
      );
      // neu checkduplicate === undefined -> cho add vao
      if (!checkDuplicate) {
        stores.push(store);
      }
    }
    await Promise.all(
      productList.map(async (item, index) => {
        const product = products[index];
        if (!product) {
          throw new Error("Invalid product!");
        }
        const store = stores.find(
          item => item._id.toString() === product.store.toString()
        );
        if (!store) {
          throw new Error("Invalid Product!");
        }
        // Trả hàng
        if (item.isReturned) {
          // Tìm hàng trả có sẵn
          let returnedProduct = await Product.findOne({
            importPrice: product.importPrice,
            exportPrice: product.exportPrice,
            isReturned: true,
            isRemoved: false
          });
          if (returnedProduct) {
            returnedProduct.quantity += item.quantity;
            returnedProduct.total += item.quantity;
            await returnedProduct.save();
          } else {
            returnedProduct = await Product.createProduct(
              {
                importPrice: product.importPrice,
                exportPrice: product.exportPrice,
                store: product.store,
                quantity: item.quantity,
                total: item.quantity,
                isReturned: true
              },
              req.user._id
            );
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
      })
    );
    for (let i = 0; i < stores.length; i++) {
      await stores[i].save();
    }
    for (let i = 0; i < products.length; i++) {
      await products[i].save();
    }
    const bill = await Bill.createBill(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}
