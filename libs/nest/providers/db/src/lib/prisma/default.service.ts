import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPostgresService } from "./postgres.service";

/** Initialization for default Prisma service. */
@Injectable()
export class PrismaService
	extends PrismaPostgresService
	implements OnModuleInit
{
	/** Initialize the Prisma Client. */
	constructor() {
		super();
	}

	/** Start the connection to the default database. */
	async onModuleInit() {
		await this.$connect();
	}

	/**
	 * Shut down Prisma Client.
	 * @param app The Nest application instance.
	 */
	async enableShutdownHooks(app: INestApplication) {
		this.$on("beforeExit", async () => {
			await app.close();
		});
	}
}
