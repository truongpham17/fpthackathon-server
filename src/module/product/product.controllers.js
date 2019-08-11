import HTTPStatus from 'http-status';

import Product from './product.model';

export const updateExportPrice = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isRemoved: false });
    if (!product) {
      throw new Error('Not found');
    }
    // Remove current product and create new one
    product.isRemoved = true;
    await product.save();
    const newProduct = await Product.create({
      createdBy: product.createdBy,
      store: product.store,
      importPrice: product.importPrice,
      exportPrice: req.body.exportPrice,
      quantity: product.quantity,
      total: product.total,
      isReturned: product.isReturned,
      isRemoved: false,
    });
    return res.status(HTTPStatus.OK).json(newProduct);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
