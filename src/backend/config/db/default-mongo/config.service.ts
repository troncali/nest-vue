import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
export class DefaultDbConfigService {
	constructor(private configService: ConfigService<MongoOptionTypes>) {}

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
		return this.configService.get<MongoDbOptions["name"]>("db.name");
	}

	/** Database host. */
	get host(): MongoDbOptions["host"] {
		return this.configService.get<MongoDbOptions["host"]>("db.host");
	}

	/** Database port. */
	get port(): MongoDbOptions["port"] {
		return this.configService.get<MongoDbOptions["port"]>("db.port");
	}

	/** Database username. */
	get username(): MongoDbOptions["username"] {
		return this.configService.get<MongoDbOptions["username"]>(
			"db.username"
		);
	}

	/** Database password. */
	get password(): MongoDbOptions["password"] {
		return this.configService.get<MongoDbOptions["password"]>(
			"db.password"
		);
	}

	/** Database name that will be the target of operations.  */
	get database(): MongoDbOptions["database"] {
		return this.configService.get<MongoDbOptions["database"]>(
			"db.database"
		);
	}

	/**
	 * Entities to load for this connection. Accepts both entity classes
	 * and directories from which entities will be loaded. Glob patterns
	 * are supported, but they cannot be used with webpack.
	 */
	get entities(): MongoDbOptions["entities"] {
		return this.configService.get<MongoDbOptions["entities"]>(
			"db.entities"
		);
	}

	/** Whether to automatically load entities.  */
	get autoLoadEntities(): MongoDbOptions["autoLoadEntities"] {
		return this.configService.get<MongoDbOptions["autoLoadEntities"]>(
			"db.autoLoadEntities"
		);
	}

	/**
	 * Whether the database schema should be created on every application
	 * launch, which can be useful during development. Alternatively, use
	 * `yarn nest schema:sync` command. For MongoDB, synchronize only creates
	 * indicies.
	 *
	 * Default: false in production (due to data loss), true in development.
	 */
	get synchronize(): MongoDbOptions["synchronize"] {
		return this.configService.get<MongoDbOptions["synchronize"]>(
			"db.synchronize"
		);
	}

	/** The full configuration object for the default database. */
	get options(): MongoDbOptions {
		return {
			name: this.name,
			type: this.type,
			host: this.host,
			port: this.port,
			username: this.username,
			password: this.password,
			database: this.database,
			entities: this.entities,
			autoLoadEntities: this.autoLoadEntities,
			synchronize: this.synchronize
		};
	}
}
