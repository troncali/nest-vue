import { registerAs } from "@nestjs/config";

/**
 * Set configurable properties for the base application
 */
export default registerAs("app", () => ({
	env: process.env.NODE_ENV,
	port: process.env.BACKEND_PORT,
	baseRoute: process.env.BACKEND_BASE_ROUTE
}));
