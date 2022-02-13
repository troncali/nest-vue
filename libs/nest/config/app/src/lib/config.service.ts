import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppEnvVars } from "./config.types";

/**
 * Configuration service for core application.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
	/**
	 * Initialize configuration service dependencies.
	 * @param configService The injected `ConfigService` instance.
	 */
	constructor(private configService: ConfigService<AppEnvVars>) {}

	/** Environment in which the application is running. */
	get env(): string | undefined {
		return this.configService.get<string>("app.env");
	}

	/** Port on which the application is listening. */
	get port(): number {
		return Number(this.configService.get<number>("app.port"));
	}

	/**
	 * Global route prefix for the application.  Used for NGINX proxy routing.
	 * @example basePath=api : NestJS routes will begin with https://localhost/api/
	 */
	get baseRoute(): string | undefined {
		return this.configService.get("app.baseRoute");
	}

	/** Name of the cookie in which encrypted session data is stored. */
	get sessionCookieName(): string {
		return this.configService.get("app.sessionCookieName") || "session";
	}

	/** Property on the session object where authenticated user data is stored. */
	get sessionUserProperty(): string {
		return this.configService.get("app.sessionUserProperty") || "user";
	}
}
