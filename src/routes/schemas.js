import Joi from "joi";

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid("user", "admin").default("user")
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string().min(2).max(50),
  password: Joi.string().min(4)
});

export const restaurantListSchema = Joi.object({
  sort: Joi.string().valid("name", "address").default("name"),
  order: Joi.string().valid("asc", "desc").default("asc"),
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1)
});

export const menuListSchema = Joi.object({
  sort: Joi.string().valid("price", "category").default("price"),
  order: Joi.string().valid("asc", "desc").default("asc"),
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1)
});