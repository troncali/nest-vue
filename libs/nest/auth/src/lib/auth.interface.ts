import { FastifyRequest } from "fastify";
import { UserSession } from "@nest-vue/models/session";

export interface AuthRequest extends FastifyRequest {
	/** Session of the authenticated user making the request. */
	user?: UserSession | null;
}

/** The credentials asserted for authentication. */
export interface AuthCredentials {
	/** The email asserted for authentication. */
	email: string;
	/** The password asserted for authentication. */
	password: string;
}
