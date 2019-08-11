import Joi from 'joi';

export default {
  updateExportPrice: {
    body: {
      exportPrice: Joi.number().min(0).required(),
    },
  },
};
