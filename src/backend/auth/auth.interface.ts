import { UserSession } from "../models/session/session.dto";

declare module "fastify" {
	interface FastifyRequest {
		/** Session of the authenticated user making the request. */
		user?: UserSession | null;
	}
}
