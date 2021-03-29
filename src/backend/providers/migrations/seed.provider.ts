import { Injectable } from "@nestjs/common";

import { BaseSeederService } from "@/backend/models/base.seeder.service";
import { UsersSeederService } from "@/backend/models/users/migrations/users.seeder.service";

/**
 * Seed service that dispatches database actions.
 *
 * @class
 */
@Injectable()
export class SeedProvider {
	constructor(private readonly Users: UsersSeederService) {}

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
