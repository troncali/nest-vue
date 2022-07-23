/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from "@nestjs/common";

import { PostgresUrl } from "@libs/nest/config/db/src/lib/connections";
import { PrismaClient } from "@nest-vue/prisma/postgres";

/** Prisma Client wrapper for the default PostgreSQL connection. */
@Injectable()
export class PrismaPostgresService extends PrismaClient {
	/** Initialize Prisma Client for the default PostgreSQL connection. */
	constructor() {
		// Ensure environment URL is set for Prisma
		if (!process.env[PostgresUrl.envVar]) {
			process.env[PostgresUrl.envVar] = PostgresUrl.url;
		}
		super();
	}
}
