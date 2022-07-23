// import { Injectable } from "@nestjs/common";

// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import { MongoUrl } from "@libs/nest/config/db/src/lib/connections";
// import { PrismaClient } from "@nest-vue/prisma/mongo";

// /** Prisma Client wrapper for the default MongoDB connection. */
// @Injectable()
// export class PrismaMongoService extends PrismaClient {
// 	/** Initialize Prisma Client for the default MongoDB connection. */
// 	constructor() {
// 		// Ensure environment URL is set for Prisma
// 		if (!process.env[MongoUrl.envVar]) {
// 			process.env[MongoUrl.envVar] = MongoUrl.url;
// 		}
// 		super();
// 	}
// }
