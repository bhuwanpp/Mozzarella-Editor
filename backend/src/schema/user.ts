import Joi from "joi";

export const getUserQuerySchema = Joi.object({
  q: Joi.string().optional(),
  page: Joi.number()
    .min(1)
    .optional()
    .messages({
      "number.base": "page must be a number",
      "number.min": "page must be  greater than or equal to 1",
    })
    .default(1),

  size: Joi.number()
    .min(1)
    .max(10)
    .optional()
    .messages({
      "number.base": "size must be a number",
      "number.min": "size must be greater than or  equal to 1 ",
      "number.max": "size must be less than or  equal to 1 ",
    })
    .default(10),
}).options({
  stripUnknown: true,
});

export const createUserBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be  a valid format",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is requred",
      "string.min": "Password must be atleast 8 character",
      "password.uppercase":
        "Password  must have atleast one uppercase character",
      "password.lowercase":
        "Password  must have atleast one lowercase character",
      "password.special": "Password  must have atleast one special character",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }
      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }
      if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }
      return value;
    }),
}).options({
  stripUnknown: true,
});
