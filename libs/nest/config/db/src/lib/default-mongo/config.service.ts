import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory } from "@nestjs/typeorm";

import {
	MongoDbOptions,
	MongoOptionTypes,
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
	/**
	 * Initialize configuration service dependencies.
	 * @param configService The injected `ConfigService` instance.
	 */
	constructor(private configService: ConfigService<MongoOptionTypes>) {}

	/** Generate the full configuration object for the default database. */
	createTypeOrmOptions(): MongoDbOptions {
		return {
			name: this.name,
			type: this.type,
			host: this.host,
			port: this.port,
			username: this.username,
			password: this.password,
			database: this.database,
			autoLoadEntities: this.autoLoadEntities,
			migrations: this.migrations
		};
	}

	/** Database type. */
	get type(): MongoDbOptions["type"] {
		return TypeOrmDatabaseTypes.MongoDB;
	}

	/**
	 * Name of the database connection. Can be used to identify the connection
	 * for a particular database operation. Each connection must have a
	 * different name. If no name is given, it will be called "default".
	 */
	get name(): MongoDbOptions["name"] {
		return this.configService.get("db.name");
	}

	/** Database host. */
	get host(): MongoDbOptions["host"] {
		return this.configService.get("db.host");
	}

	/** Database port. */
	get port(): MongoDbOptions["port"] {
		return this.configService.get("db.port");
	}

	/** Database username. */
	get username(): MongoDbOptions["username"] {
		return this.configService.get("db.username");
	}

	/** Database password. */
	get password(): MongoDbOptions["password"] {
		return this.configService.get("db.password");
	}

	/** Database name that will be the target of operations.  */
	get database(): MongoDbOptions["database"] {
		return this.configService.get("db.database");
	}

	/** Whether to automatically load entities.  */
	get autoLoadEntities(): MongoDbOptions["autoLoadEntities"] {
		return this.configService.get("db.autoLoadEntities");
	}

	/** Migrations to load for the `MigrationProvider`. */
	get migrations(): MongoDbOptions["migrations"] {
		return this.configService.get("db.migrations");
	}

	/**
	 * Whether the database schema should be created on every application
	 * launch, which can be useful during development. Alternatively, use
	 * `yarn nest schema:sync` command. For MongoDB, synchronize only creates
	 * indicies.
	 *
	 * Default: false in production (due to data loss), true in development.
	 */
	// get synchronize(): MongoDbOptions["synchronize"] {
	// 	return this.configService.get("db.synchronize");
	// }
}
