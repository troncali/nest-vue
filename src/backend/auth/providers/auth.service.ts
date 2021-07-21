import { Injectable } from "@nestjs/common";

import { CipherProvider } from "../../providers/cipher.provider";
import { SessionService } from "../../models/session/providers/session.service";
import { UserService } from "../../models/user/providers/user.service";
import { UserSession } from "../../models/session/session.dto";

/**
 * Verifies authentication.
 */
@Injectable()
export class AuthService {
	/**
	 * Initialize authorization dependencies.
	 * @param userService The injected `UserService` instance.
	 * @param sessionService The injected `SessionService` instance.
	 * @param cipherProvider The injected `CipherProvider` instance.
	 */
	constructor(
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly cipherProvider: CipherProvider
	) {}

	/**
	 * Evaluates whether the asserted email and password match a `User` in the
	 * database, and creates a session if authentication succeeds.
	 *
	 * @example
	 * const session = await this.authService.authenticate(email, password);
	 *
	 * @param email The email asserted for authentication.
	 * @param password The password asserted for authentication.
	 *
	 * @returns A `UserSession`, if successful, or `false`.
	 */
	async authenticate(
		email: string,
		password: string
	): Promise<UserSession | false> {
		const user = await this.userService.getUserForAuth(email);

		if (user?.password) {
			const attempt = await this.cipherProvider.verifyHash(
				user.password,
				password
			);
			delete user.password;
			return attempt ? await this.sessionService.create(user) : false;
		}

		return false;
	}
}
