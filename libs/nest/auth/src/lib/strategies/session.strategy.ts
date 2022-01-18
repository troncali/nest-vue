import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { FastifyRequest } from "fastify";

import { AppConfigService } from "@vxnn/nest/config/app";

import { FastifySessionStrategy } from "./nest-fastify-session";
import { UserSession } from "@vxnn/models/session";

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
	 * @returns UserSession
	 */
	async validate(request: FastifyRequest) {
		const user: UserSession | undefined = request.session.get(
			this.appConfig.sessionUserProperty
		);
		if (!user || !user.sessionId) throw new UnauthorizedException();
		return user;
	}
}
