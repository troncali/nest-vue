import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { TypeOrmDatabaseTypes } from "../config.types";
import { DockerHandler } from "../../../../lib/docker-handler";

// Available connection options:
// - https://typeorm.io/#/connection-options
// - https://docs.nestjs.com/techniques/database

export default registerAs(
	"db",
	(): TypeOrmModuleOptions => ({
		type: TypeOrmDatabaseTypes.Postgres,
		name: "default",
		host:
			process.env.DOCKER_ENV !== "true"
				? "localhost"
				: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: DockerHandler.getSecretSync("DB_USERNAME"),
		password: async () => await DockerHandler.getSecret("DB_PASSWORD"),
		database: process.env.DB_DATABASE_NAME,
		schema: process.env.DB_SCHEMA,
		// For SSL configuration, see https://node-postgres.com/features/ssl
		ssl: false,
		// Note: entity glob patterns do not work with webpack
		entities: [],
		autoLoadEntities:
			process.env.DB_AUTO_LOAD_ENTITIES == "true" ? true : false,
		// Warning: do not use 'true' in production or data can be lost
		synchronize: process.env.NODE_ENV == "production" ? false : true
	})
);
