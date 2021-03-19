import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { DefaultDbConfigService } from "./default-postgres/config.service";
import configuration from "./default-postgres/configuration";
import validationSchema from "./config.validation";

/**
 * Import and provide database-related configuration classes.
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
	providers: [ConfigService, DefaultDbConfigService],
	exports: [ConfigService, DefaultDbConfigService]
})
export class DbConfigModule {}
