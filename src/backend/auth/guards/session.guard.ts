import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/**
 * Validates encrypted `fastify-secure-session` cookie to allow requests only
 * from authenticated users with an active session.  Implements
 * `fastify-session` Passport strategy.
 */
@Injectable()
export class SessionGuard extends AuthGuard("fastify-session") {
	constructor() {
		super({
			// Set options passed to Strategy.authenticate()
		});
	}
}
