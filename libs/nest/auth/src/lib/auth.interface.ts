import { FastifyRequest } from "fastify";
import { UserSession } from "@vxnn/models/session";

// declare module "fastify" {
// 	export interface FastifyRequest {
// 		/** Session of the authenticated user making the request. */
// 		user?: UserSession | null;
// 	}
// }

export interface AuthRequest extends FastifyRequest {
	/** Session of the authenticated user making the request. */
	user?: UserSession | null;
}
