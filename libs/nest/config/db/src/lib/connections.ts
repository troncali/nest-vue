import "dotenv/config";
import { DockerHandler } from "@nest-vue/docker-handler";
import { DbConnectionTypes, DbEnvUrl } from "./config.types";

/** Connection details for the default database. */
export const DefaultDbConnection: DbConnectionTypes = {
	host: process.env.DOCKER_ENV !== "true" ? "localhost" : process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: DockerHandler.getSecretSync("DB_USERNAME"),
	password: DockerHandler.getSecretSync("DB_PASSWORD"),
	database: process.env.DB_DATABASE_NAME
};

/** Postgres URL details for the default database. (Used by Prisma.) */
export const PostgresUrl: DbEnvUrl = {
	envVar: "POSTGRES_URL",
	url:
		`postgresql://${DefaultDbConnection.username}:` +
		`${DefaultDbConnection.password}@${DefaultDbConnection.host}:` +
		`${DefaultDbConnection.port}/${DefaultDbConnection.database}` +
		`?schema=${process.env.DB_SCHEMA}`
};

/** MongoDB URL details for the default database. (Used by Prisma.) */
export const MongoUrl: DbEnvUrl = {
	envVar: "MONGO_URL",
	url:
		`mongodb://${DefaultDbConnection.username}:` +
		`${DefaultDbConnection.password}@${DefaultDbConnection.host}:` +
		`${DefaultDbConnection.port}/${DefaultDbConnection.database}`
};
