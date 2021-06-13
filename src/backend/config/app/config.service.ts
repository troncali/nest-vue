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
	 * @example basePath=v1 : NestJS routes will begin with https://localhost/v1/
	 */
	get baseRoute(): string | undefined {
		return this.configService.get("app.baseRoute");
	}
}
