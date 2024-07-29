import Joi from "joi";

export const getCreateTaskSchema = Joi.object({
  todo: Joi.string().required().messages({
    "any.required": "todo is required",
    "string.empty": "todo cannot be empty",
  }),
}).options({
  stripUnknown: true,
});

export const paramSchema = Joi.object({
  id: Joi.required().messages({
    "any.required": "ID is required",
  }),
}).options({
  stripUnknown: true,
});
