import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import configuration from "./configuration";
import { GqlConfigService } from "./config.service";

/**
 * Import and provide GraphQL-related configuration classes.
 *
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			cache: true
		})
	],
	providers: [ConfigService, GqlConfigService],
	exports: [ConfigService, GqlConfigService]
})
export class GqlConfigModule {}
