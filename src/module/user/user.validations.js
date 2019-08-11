import Joi from "joi";

export default {
  register: {
    body: {
      fullname: Joi.string(),
      role: Joi.number(),
      password: Joi.string()
        .min(6)
        .max(120)
        .required(),
      username: Joi.string()
        .min(5)
        .max(20)
        .required()
    }
  },
  createUser: {
    body: {
      password: Joi.string()
        .min(6)
        .max(120)
        .required(),
      fullname: Joi.string(),
      role: Joi.number(),
      username: Joi.string()
        .min(5)
        .max(20)
        .required()
    }
  },
  login: {
    body: {
      password: Joi.string()
        .min(6)
        .max(120)
        .required(),
      username: Joi.string()
        .min(5)
        .max(20)
        .required()
    },
    options: {
      allowUnknownBody: false
    }
  },
  editProfile: {
    body: {
      password: Joi.string()
        .min(6)
        .max(120),
      username: Joi.string()
        .min(5)
        .max(20),
      fullname: Joi.string(),
      role: Joi.number(),
      active: Joi.boolean()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
