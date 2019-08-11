import Joi from 'joi';

export default {
  createStore: {
    body: {
      name: Joi.string().required(),
      totalImportProduct: Joi.number().min(0),
      productQuantity: Joi.number().min(0),
      debt: Joi.number(),
    },
  },
  importStore: {
    body: {
      storeId: Joi.string().required(),
      productList: Joi.array().items(Joi.object({
        importPrice: Joi.number().required(),
        exportPrice: Joi.number().required(),
        quantity: Joi.number(),
      })),
      note: Joi.string(),
    },
  },
  editStore: {
    body: {
      name: Joi.string(),
      totalImportProduct: Joi.number().min(0),
      productQuantity: Joi.number().min(0),
      debt: Joi.number().min(0),
    },
  },
};
