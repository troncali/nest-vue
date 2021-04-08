import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";

/** Service for handling ciphers. */
@Injectable()
export class CipherProvider {
	/**
	 * Hashes the provided string using the `Argon2id` algorithm recommended by
	 * OWASP. See:
	 * - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
	 * - https://security.stackexchange.com/questions/193351/in-2018-what-is-the-recommended-hash-to-store-passwords-bcrypt-scrypt-argon2
	 *
	 * @example const hash = await CipherProvider.oneWayHash(password);
	 *
	 * @param data The data to encrypt
	 *
	 * @returns {Promise<string>} Hashed string.
	 */
	async oneWayHash(data: string): Promise<string> {
		return await argon2.hash(data, {
			// Options: https://github.com/ranisalt/node-argon2/wiki/Options
			type: argon2.argon2id,
			memoryCost: 4096, // KiB
			timeCost: 8, // iterations
			parallelism: 1 // threads
		});
	}

	/**
	 * Verifies whether a `utf8` string matches the provided hash.
	 *
	 * @example let attempt;
	 * if (user?.password) {
	 * 	const attempt = await this.cipherProvider.verifyHash(user.password, password);
	 * }
	 *
	 * @param hash The hash to verify against.
	 * @param plain The string to verify.
	 *
	 * @returns {Promise<boolean>} True if the string and hash match.
	 */
	async verifyHash(hash: string, plain: string): Promise<boolean> {
		return await argon2.verify(hash, plain);
	}
}
