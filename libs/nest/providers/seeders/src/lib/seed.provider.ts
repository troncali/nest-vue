import { Injectable } from "@nestjs/common";

import { BaseSeederService } from "@nest-vue/models/base-model";
import { SessionSeederService } from "@nest-vue/models/session";
import { UserSeederService } from "@nest-vue/models/user";

/**
 * Seed service that dispatches database actions.
 *
 * @class
 */
@Injectable()
export class SeedProvider {
	/** Load each SeederService. */
	constructor(
		// Order matters for data with dependent relationships (Users/Sessions)
		private readonly Users: UserSeederService,
		private readonly Sessions: SessionSeederService
	) {}

	/**
	 * Runs `hydrate` method for every `SeederService` in `SeedProvider`'s
	 * constructor.
	 * @param orm The ORM to use for seeding data. Either Prisma or TypeORM.
	 */
	async seed(orm: "Prisma" | "TypeORM") {
		await Promise.all(
			Object.entries(this).map(async ([key, value]) => {
				if (value instanceof BaseSeederService)
					await value.hydrate(key, orm);
			})
		);
	}
}
