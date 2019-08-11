import Joi from "joi";

export default {
  addDebt: {
    body: {
      id: Joi.string(),
      username: Joi.string().min(2).max(40),
      phone: Joi.string(),
      address: Joi.string(),
      debt: Joi.number().required().min(0),
    }
  },
};
