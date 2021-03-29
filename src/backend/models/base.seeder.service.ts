import { Repository } from "typeorm";
import { Logger } from "@nestjs/common";

/**
 * Establish methods for all Seeder services.
 */
export abstract class BaseSeederService<U, T extends Repository<U>> {
	constructor(public readonly repository: T) {}

	/**
	 * Build and return an array of entities and/or DTOs containing data to
	 * seed.
	 */
	abstract buildSeed(): Promise<any[]>;

	/**
	 * Saves seed data returned by `buildSeed` method.
	 * @param seederName Name of the seeder.
	 */
	async hydrate(seederName: string) {
		const seed = await this.buildSeed();

		await this.repository.clear();
		await this.repository
			.save(seed)
			.then(() => Logger.log(`√ ${seederName}`))
			.catch((e) => {
				Logger.error(
					`${seederName} failed: ${
						e.detail ? e.message + " - " + e.detail : e.message
					}`
				);
			});
	}
}

// TODO: turn BaseSeederService into a dynamic module, or function that returns a class as described here: https://youtu.be/jo-1EUxMmxc
