// src/middlewares/validate.js
import Joi from "joi";

/**
 * @param {Joi.Schema} schema 
 * @param {string} property 
 */
export function validate(schema, property = "query") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map((d) => d.message),
      });
    }
    Object.assign(req[property], value);

    next();
  };
}