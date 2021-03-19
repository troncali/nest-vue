// import * as Joi from "@hapi/joi";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppConfigService } from "./config.service";
import configuration from "./configuration";
import validationSchema from "./config.validation";

/**
 * Import and provide base application configuration classes.
 *
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			cache: true,
			validationSchema: validationSchema
		})
	],
	providers: [ConfigService, AppConfigService],
	exports: [ConfigService, AppConfigService]
})
export class AppConfigModule {}
