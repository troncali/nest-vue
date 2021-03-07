import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory } from "@nestjs/typeorm";

import {
	PostgresDbOptions,
	PostgresOptionTypes,
	TypeOrmDatabaseTypes
} from "../config.types";

/**
 * Configuration service for default database connection via TypeORM. See
 * options at https://typeorm.io/#/connection-options.
 *
 * @class
 */
@Injectable()
export class DefaultDbConfigService implements TypeOrmOptionsFactory {
	constructor(private configService: ConfigService<PostgresOptionTypes>) {}

	/** Generate the full configuration object for the default database. */
	createTypeOrmOptions(): PostgresDbOptions {
		return {
			name: this.name,
			type: this.type,
			host: this.host,
			port: this.port,
			username: this.username,
			password: this.password,
			database: this.database,
			schema: this.schema,
			ssl: this.ssl,
			entities: this.entities,
			autoLoadEntities: this.autoLoadEntities,
			synchronize: this.synchronize
		};
	}

	/** Database type. */
	get type(): PostgresDbOptions["type"] {
		return TypeOrmDatabaseTypes.Postgres;
	}

	/**
	 * Name of the database connection. Can be used to identify the connection
	 * for a particular database operation. Each connection must have a
	 * different name. If no name is given, it will be called "default".
	 */
	get name(): PostgresDbOptions["name"] {
		return this.configService.get<PostgresDbOptions["name"]>("db.name");
	}

	/** Database host. */
	get host(): PostgresDbOptions["host"] {
		return this.configService.get("db.host");
	}

	/** Database port. */
	get port(): PostgresDbOptions["port"] {
		return this.configService.get("db.port");
	}

	/** Database username. */
	get username(): PostgresDbOptions["username"] {
		return this.configService.get("db.username");
	}

	/**
	 * Database password.
	 *
	 * @returns A function that returns a promise-wrapped string.
	 */
	get password(): PostgresDbOptions["password"] {
		return this.configService.get("db.password");
	}

	/** Database name that will be the target of operations.  */
	get database(): PostgresDbOptions["database"] {
		return this.configService.get("db.database");
	}

	/** Database schema that will be the target of operations.  */
	get schema(): PostgresDbOptions["schema"] {
		return this.configService.get("db.schema");
	}

	/** Object with SSL parameters.  */
	get ssl(): PostgresDbOptions["ssl"] {
		return this.configService.get("db.ssl");
	}

	/**
	 * Entities to load for this connection. Accepts both entity classes
	 * and directories from which entities will be loaded. Glob patterns
	 * are supported, but they cannot be used with webpack.
	 */
	get entities(): PostgresDbOptions["entities"] {
		return this.configService.get("db.entities");
	}

	/** Whether to automatically load entities.  */
	get autoLoadEntities(): PostgresDbOptions["autoLoadEntities"] {
		return this.configService.get("db.autoLoadEntities");
	}

	/**
	 * Whether the database schema should be created on every application
	 * launch, which can be useful during development. Alternatively, use
	 * `yarn nest schema:sync` command.
	 *
	 * Default: false in production (due to data loss), true in development.
	 */
	get synchronize(): PostgresDbOptions["synchronize"] {
		return this.configService.get("db.synchronize");
	}
}
