import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { TlsOptions } from "tls";

/** Types for PostgreSQL's configurable options. */
export type PostgresDbOptions = {
	type: "postgres";
} & TypeOrmModuleOptions;

/** Types for MongoDB's configurable options. */
export type MongoDbOptions = {
	type: "mongodb";
} & TypeOrmModuleOptions;

/** Base database configuration properties for intellisense. */
export interface BaseDbOptionTypes {
	"db.type": string;
	"db.name": string;
	"db.host": string;
	"db.port": number;
	"db.username": string;
	"db.database": string;
	"db.autoLoadEntities": boolean;
	"db.migrations": [];
	// "db.entities": [];
	// "db.logging": boolean;
	// "db.synchronize": boolean;
}

/** PostgreSQL's configuration properties for intellisense. */
export interface PostgresOptionTypes extends BaseDbOptionTypes {
	"db.password": string | (() => string) | (() => Promise<string>);
	"db.schema": string;
	"db.ssl": boolean | TlsOptions;
}

/** MongoDB's configuration properties for intellisense. */
export interface MongoOptionTypes extends BaseDbOptionTypes {
	"db.password": string;
}

/** TypeORM's compatible database types */
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
