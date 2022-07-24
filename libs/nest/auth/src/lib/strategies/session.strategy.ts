import { Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { PassportStrategy } from "@nestjs/passport";

import { AppConfigService } from "@nest-vue/nest/config/app";
import { UserSession } from "@nest-vue/models/session";

import {
	FastifySessionStrategy,
	SessionValidatorCallback
} from "./nest-fastify-session";

/**
 * Passport strategy for authentication via session cookie.
 */
@Injectable()
export class SessionStrategy extends PassportStrategy(FastifySessionStrategy) {
	/**
	 * Initialize authentication dependencies and options.
	 * @param authService The injected AuthService instance.
	 */
	constructor(private readonly appConfig: AppConfigService) {
		super({
			// Set options for FastifySessionStrategy
		});
	}

	/**
	 * Validates the session cookie. If successful, appends the `UserSession` to
	 * the `Request` object as `req.user`.
	 * @param request The current `Request` object with the session cookie.
	 * @param done A function that exposes this strategy's success() method.
	 */
	async validate(request: FastifyRequest, done: SessionValidatorCallback) {
		const user: UserSession = request.session.get(
			this.appConfig.sessionUserProperty
		);
		// If there is no valid session, calling fail() method has the desired
		// effect for routes protected only by SessionGuard (blocks accesss)
		// but when combined with EmailAuthGuard the 'local' strategy is called
		// twice. Returning without success or failure prevents duplication.
		if (!user || !user.sessionId) return;
		return done(user);
	}
}
