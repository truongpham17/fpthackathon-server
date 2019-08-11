import Joi from 'joi';

export default {
  createBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        // product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
        isReturned: Joi.boolean(),
      })).min(1).required(),
      customer: Joi.object().keys({
        username: Joi.string().allow(''),
        phone: Joi.string().allow(''),
        address: Joi.string().allow(''),
        isNew: Joi.boolean().allow('')
      }),
      note: Joi.string().allow(''),
      // totalQuantity: Joi.number().required(),
      // totalPrice: Joi.number().required(),
      // otherCost: Joi.number().allow(null),
      // totalPaid: Joi.number().required(),
    },
  },
  createReturnedBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
        isReturned: Joi.boolean(),
      })).min(1).required(),
      customer: Joi.object().keys({
        name: Joi.string().allow(''),
        phone: Joi.string().allow(''),
        address: Joi.string().allow(''),
      }),
      note: Joi.string().allow(''),
      totalQuantity: Joi.number().required(),
      totalPrice: Joi.number().required(),
      otherCost: Joi.number().allow(null),
      totalPaid: Joi.number().allow(null),
    },
  },
  editBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
        isReturned: Joi.boolean(),
      })).min(1),
      customer: Joi.object().keys({
        name: Joi.string(),
        phone: Joi.string(),
        address: Joi.string(),
      }),
      note: Joi.string(),
      totalQuantity: Joi.number(),
      totalPrice: Joi.number(),
      otherCost: Joi.number(),
      totalPaid: Joi.number(),
    },
  },
};
