import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { GqlConfigService } from "./config.service";
import configuration from "./configuration";
import validationSchema from "./config.validation";

/**
 * Import and provide GraphQL-related configuration classes.
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
	providers: [ConfigService, GqlConfigService],
	exports: [ConfigService, GqlConfigService]
})
export class GqlConfigModule {}
