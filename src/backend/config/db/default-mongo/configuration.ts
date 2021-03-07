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
		type: TypeOrmDatabaseTypes.MongoDB,
		name: "default",
		host:
			process.env.DOCKER_ENV !== "true"
				? "localhost"
				: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: DockerHandler.getSecretSync("DB_USERNAME"),
		password: DockerHandler.getSecretSync("DB_PASSWORD"),
		database: process.env.DB_DATABASE_NAME,
		// For SSL configuration, see
		// https://typeorm.io/#/connection-options/mongodb-connection-options
		// ssl: false,
		// Note: entity glob patterns do not work with webpack
		entities: [],
		autoLoadEntities:
			process.env.DB_AUTO_LOAD_ENTITIES == "true" ? true : false,
		// Warning: do not use 'true' in production or data can be lost
		synchronize: process.env.NODE_ENV == "production" ? false : true
	})
);
