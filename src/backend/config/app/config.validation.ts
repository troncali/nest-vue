import * as Joi from "joi";

/**
 * Set the validation schema for environment variables used by the
 * base application configuration service.
 */
export default Joi.object({
	NODE_ENV: Joi.string()
		.valid("development", "production", "testing")
		.default("development"),
	BACKEND_PORT: Joi.number().required().default(3001),
	BACKEND_BASE_ROUTE: Joi.string().required()
});
