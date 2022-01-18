import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { CipherProvider } from "@vxnn/nest/providers/cipher";
import { SessionService } from "@vxnn/models/session";
import { UserService } from "@vxnn/models/user";
import { UserSession } from "@vxnn/models/session";

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
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => SessionService))
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
