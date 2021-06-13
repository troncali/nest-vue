import { Injectable } from "@nestjs/common";

import { BaseSeederService } from "../../models/base.seeder.service";
import { UserSeederService } from "../../models/user/migrations/user.seeder.service";
import { SessionSeederService } from "../../models/session/migrations/session.seeder.service";

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
	 */
	async seed() {
		await Promise.all(
			Object.entries(this).map(async ([key, value]) => {
				if (value instanceof BaseSeederService)
					await value.hydrate(key);
			})
		);
	}
}
