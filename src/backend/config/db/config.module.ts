// import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import defaultConfiguration from "./default-postgres/configuration";
import { DefaultDbConfigService } from "./default-postgres/config.service";

/**
 * Import and provide database-related configuration classes.
 *
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [defaultConfiguration],
			cache: true
		})
	],
	providers: [ConfigService, DefaultDbConfigService],
	exports: [ConfigService, DefaultDbConfigService]
})
export class DbConfigModule {}

// TODO: add additional Mongo config options.
// TODO: refactor config services to extend a base class, so that common options aren't duplicated
