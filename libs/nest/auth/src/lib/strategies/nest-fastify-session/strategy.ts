import type { FastifyRequest } from "fastify";
import { UserSession } from "@nest-vue/models/session";

import { BaseStrategy } from "./base";

/**
 * Authenticates requests based on the existence of a valid, encrypted
 * `fastify-secure-session` cookie containing a `UserSession` object with an
 * active `sessionId`.
 *
 * A `validateSession` callback must be supplied that evaluates the validity of
 * the cookie and `sessionId` , then calls the `done` callback supplying the
 * `UserSession` object from the cookie, which should be set to `false` if the
 * cookie or `sessoinId` is invalid. Set `err` if an exceptoin occurs.
 *
 * @param {Object} options
 * @param {Function} verify
 */
export class FastifySessionStrategy extends BaseStrategy {
	private _validate;

	/**
	 * Initialize the Strategy with the provided options and validation
	 * callback.
	 * @param options Configuration for the Strategy.
	 * @param validateSession Callback used to verify `fastify-secure-session`
	 * cookie and `sessionId`
	 */
	constructor(validateSession: SessionValidator);
	constructor(options: any, validateSession: SessionValidator);
	constructor(options: any, validateSession?: SessionValidator) {
		if (typeof options === "function") {
			validateSession = options;
			options = undefined;
		}
		if (!validateSession) {
			throw new TypeError("SessionStrategy.validate() method required");
		}

		options = options || {};
		super(options.name || "fastify-session");
		this._validate = validateSession;
	}

	/**
	 * Authenticate request based on valid `fastify-secure-session` cookie.
	 * @param request The current `request` object.
	 * @param options Options for Strategy.authenticate()
	 * @returns
	 */
	async authenticate(
		request: FastifyRequest,
		options?: { pauseStream?: boolean }
	) {
		if (!request.session) {
			return this.error(new Error("fastify-secure-session not in use"));
		}

		options = options || {};
		if (options.pauseStream) {
			return this.error(
				new Error(
					"fastify-session strategy doesn't support pauseStream."
				)
			);
		}

		const done: SessionValidatorCallback = async (user) => {
			if (!user) return this.fail();
			return this.success(user);
		};

		await this._validate(request, done).catch((e) => this.error(e));
	}
}

export type SessionValidator = (
	request: FastifyRequest,
	callback: SessionValidatorCallback
) => Promise<UserSession>;

export type SessionValidatorCallback = (
	user: UserSession | false
) => Promise<void>;
