import { Injectable } from "@nestjs/common";

import { BaseSeederService } from "@vxnn/models/base-model";
import { UserSeederService } from "@vxnn/models/user";
import { SessionSeederService } from "@vxnn/models/session";

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
