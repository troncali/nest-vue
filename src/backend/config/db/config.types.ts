import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { TlsOptions } from "tls";

/** Types for PostgreSQL's configurable options. */
type PostgresDbOptions = {
	type: "postgres";
} & TypeOrmModuleOptions;

/** Types for MongoDB's configurable options. */
type MongoDbOptions = {
	type: "mongodb";
} & TypeOrmModuleOptions;

/** Base database configuration properties for intellisense. */
interface BaseDbOptionTypes {
	// Full property path is required for nested properties.
	"db.type": string;
	"db.name": string;
	"db.host": string;
	"db.port": number;
	"db.username": string;
	"db.database": string;
	"db.entities": [];
	"db.autoLoadEntities": boolean;
	"db.synchronize": boolean;
}

/** PostgreSQL's configuration properties for intellisense. */
interface PostgresOptionTypes extends BaseDbOptionTypes {
	"db.password": string | (() => string) | (() => Promise<string>);
	"db.schema": string;
	"db.ssl": boolean | TlsOptions;
}

/** MongoDB's configuration properties for intellisense. */
interface MongoOptionTypes extends BaseDbOptionTypes {
	"db.password": string;
}

/** TypeORM's compatible database types */
enum TypeOrmDatabaseTypes {
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

export {
	PostgresDbOptions,
	MongoDbOptions,
	PostgresOptionTypes,
	MongoOptionTypes,
	TypeOrmDatabaseTypes
};
