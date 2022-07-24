import { TypeOrmModuleOptions } from "@nestjs/typeorm";

/** Types for PostgreSQL's configurable options. */
export type PostgresDbOptions = {
	type: "postgres";
} & TypeOrmModuleOptions;

/** Types for MongoDB's configurable options. */
export type MongoDbOptions = {
	type: "mongodb";
} & TypeOrmModuleOptions;

/** Base database configuration properties. */
export interface BaseDbOptionTypes {
	/** Database type. */
	"db.type": string;
	/**
	 * Name of the database connection. Can be used to identify the connection
	 * for a particular database operation. Each connection must have a
	 * different name. If no name is given, it will be called "default".
	 */
	"db.name": string;
	/** Database host. */
	"db.host": string;
	/** Database port. */
	"db.port": number;
	/** Database username. */
	"db.username": string;
	/** Database name that will be the target of operations.  */
	"db.database": string;
	/** Whether to automatically load entities.  */
	"db.autoLoadEntities": boolean;
	/** Migrations to load for the `MigrationProvider`. */
	"db.migrations": [];
}

/** PostgreSQL's configuration properties. */
export interface PostgresOptionTypes extends BaseDbOptionTypes {
	/** Database password. */
	"db.password": string | (() => string) | (() => Promise<string>);
	/** Database schema that will be the target of operations.  */
	"db.schema": string;
}

/** MongoDB's configuration properties. */
export interface MongoOptionTypes extends BaseDbOptionTypes {
	/** Database password. */
	"db.password": string;
}

/** TypeORM's compatible database types. */
export enum TypeOrmDatabaseTypes {
	BetterSQLite3 = "better-sqlite3",
	CockroachDB = "cockroachdb",
	Cordova = "cordova",
	MariaDB = "mariadb",
	MongoDB = "mongodb",
	MsSQL = "mssql",
	MySQL = "mysql",
	NativeScript = "nativescript",
	Oracle = "oracle",
	Postgres = "postgres",
	ReactNative = "react-native",
	SQLite = "sqlite",
	SQLjs = "sqljs"
}

/** Database connection properties. */
export interface DbConnectionTypes {
	/** Database host. */
	host?: string;
	/** Database port. */
	port?: number;
	/** Database username. */
	username?: string;
	/** Database password. */
	password?: string;
	/** Database name that will be the target of operations.  */
	database?: string;
}

/** Database connection URL details. */
export interface DbEnvUrl {
	/** Environment variable assigned the connection URL. */
	envVar: string;
	/** Full connection URL. */
	url: string;
}
