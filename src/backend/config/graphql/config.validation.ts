import * as Joi from "joi";

/**
 * Set the validation schema for environment variables used by the GraphQL
 * configuration service.
 */
export default Joi.object({
	BACKEND_BASE_ROUTE: Joi.string().required(),
	GRAPHQL_PATH: Joi.string().required().default("graphql")
});
