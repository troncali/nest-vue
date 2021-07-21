import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy } from "passport-local";

import { AuthService } from "../providers/auth.service";
import { UserSession } from "../../models/session/session.dto";

/**
 * Passport strategy for local authentication via email and password.
 */
@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy) {
	/**
	 * Initialize authentication dependencies and options.
	 * @param authService The injected AuthService instance.
	 */
	constructor(private readonly authService: AuthService) {
		super({ usernameField: "email" });
	}

	/**
	 * Authenticates the asserted user. If successful, returns a session that
	 * is appended to the `Request` object as `req.user`.
	 * @param email The email asserted for authentication.
	 * @param password The password asserted for authentication.
	 * @returns UserSession
	 */
	async validate(email: string, password: string): Promise<UserSession> {
		const session = await this.authService.authenticate(email, password);
		if (!session) throw new UnauthorizedException();
		return session;
	}
}
