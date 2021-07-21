import {
	Controller,
	Get,
	Post,
	Req,
	Res,
	Session,
	UseGuards
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import * as secureSession from "fastify-secure-session";

import { AppConfigService } from "../config/app/config.service";
import { SessionService } from "../models/session/providers/session.service";

import { EmailAuthGuard } from "./guards/email.auth.guard";
import { SessionGuard } from "./guards/session.guard";

/** Base authentication-related routing, prefixed with
 * `/{BACKEND_BASE_PATH}/` */
@Controller()
export class AuthController {
	/**
	 * Initialize controller dependencies.
	 * @param appConfig: The injected `AppConfigService` instance.
	 * @param sessionService The injected `SessionService` instance.
	 */
	constructor(
		private readonly appConfig: AppConfigService,
		private readonly sessionService: SessionService
	) {}

	/**
	 * Authenticate a `User`: `/login`
	 * @param response The pending response.
	 * @param req The authorized request.
	 * @param session The current user session.
	 * @returns `UserSession`
	 */
	@UseGuards(EmailAuthGuard)
	@Post("login")
	async login(
		@Res({ passthrough: true }) response: FastifyReply,
		@Req() req: FastifyRequest,
		@Session() session: secureSession.Session
	) {
		// TODO: If there is an existing session cookie, use it to authenticate

		session.set(this.appConfig.sessionUserProperty, req.user);
		response.setCookie("abilities", "placeholder", {
			httpOnly: true,
			sameSite: true,
			secure: true
		});
		return req.user;
	}

	/**
	 * Sample protected content for authenticated users: `/protected`
	 * @returns String
	 */
	@UseGuards(SessionGuard)
	@Get("protected")
	async protected() {
		return "[Protected content]";
	}

	/**
	 * Log out a `User`: `/logout`
	 * @param response The pending response.
	 * @param session The current user session.
	 * @returns String
	 */
	@Get("logout")
	async logout(
		@Res({ passthrough: true }) response: FastifyReply,
		@Session() session: secureSession.Session
	) {
		const user = session.get(this.appConfig.sessionUserProperty);
		if (user) {
			await this.sessionService.delete(user.sessionId);
			session.delete();
		}

		// Delete abilities cookie
		response.setCookie("abilities", "", { maxAge: 0 });

		return "Logged out.";
	}
}
