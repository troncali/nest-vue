import * as Joi from "joi";

/**
 * Set the validation schema for environment variables used by the default
 * database configuration service.
 */
export default Joi.object({
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().required().default(5432)
});
