const Joi = require('joi');

const userPayloadSchema = Joi.object({
  username: Joi.string().trim().min(1).required(),
  password: Joi.string().trim().min(6).required(),
  fullname: Joi.string().required(),
});

module.exports = { userPayloadSchema };
