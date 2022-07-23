import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { DefaultDbConnection } from "../connections";
import { MigrationList } from "../migration.list";
import { TypeOrmDatabaseTypes } from "../config.types";

// Available connection options:
// - https://typeorm.io/#/connection-options
// - https://docs.nestjs.com/techniques/database

export default registerAs(
	"db",
	(): TypeOrmModuleOptions => ({
		type: TypeOrmDatabaseTypes.Postgres,
		name: "default",
		...DefaultDbConnection,
		schema: process.env.DB_SCHEMA,
		// Note: `.ts` glob patterns do not work with webpack; Nest has a
		// feature to auto-load entities registered with `forFeature()`.
		autoLoadEntities: true,
		migrations: MigrationList
		// synchronize: process.env.NODE_ENV == "production" ? false : true
	})
);
