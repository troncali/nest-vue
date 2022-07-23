import {
	Controller,
	forwardRef,
	Get,
	Inject,
	Post,
	Req,
	Res,
	Session,
	UseGuards,
	VERSION_NEUTRAL
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Session as SecureSession } from "@fastify/secure-session";

import { AppConfigService } from "@nest-vue/nest/config/app";
import { SessionService, UserSessionDto } from "@nest-vue/models/session";

import { EmailAuthGuard } from "./guards/email.auth.guard";
import { SessionGuard } from "./guards/session.guard";

import { AuthRequest } from "./auth.interface";

/** Base authentication-related routing, prefixed with
 * `/{BACKEND_BASE_PATH}/` */
@Controller({ version: VERSION_NEUTRAL })
export class AuthController {
	/**
	 * Initialize controller dependencies.
	 * @param appConfig: The injected `AppConfigService` instance.
	 * @param sessionService The injected `SessionService` instance.
	 */
	constructor(
		private readonly appConfig: AppConfigService,
		@Inject(forwardRef(() => SessionService))
		private readonly sessionService: SessionService
	) {}

	/**
	 * Authenticate a `User`: `/login`
	 * @param reply The pending response.
	 * @param request The authorized request.
	 * @param session The current user session.
	 * @returns `UserSession`
	 */
	@UseGuards(EmailAuthGuard)
	@Post("login")
	async login(
		@Res({ passthrough: true }) reply: FastifyReply,
		@Req() request: AuthRequest,
		@Session() session: SecureSession
	) {
		session.set(this.appConfig.sessionUserProperty, request.user);
		reply.setCookie("abilities", "placeholder", {
			httpOnly: true,
			sameSite: true,
			secure: true
		});
		return await this.sessionService.transform(
			UserSessionDto,
			session.user
		);
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
	 * @param reply The pending response.
	 * @param session The current user session.
	 * @returns String
	 */
	@Get("logout")
	async logout(
		@Res({ passthrough: true }) reply: FastifyReply,
		@Session() session: SecureSession
	) {
		const user = session.get(this.appConfig.sessionUserProperty);
		if (user) {
			await this.sessionService.delete(user.sessionDbId);
			session.delete();
		}

		// Delete abilities cookie
		reply.setCookie("abilities", "", { maxAge: 0 });

		return "Logged out.";
	}
}
