/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from "@nestjs/common";
import { Repository } from "typeorm";

/**
 * Establish methods for all Seeder services.
 *
 * @class
 */
export abstract class BaseSeederService<T> {
	/**
	 * Initialize seeder dependencies.
	 * @param repository The injected repository instance.
	 */
	constructor(
		public readonly repository: Repository<T>,
		public readonly prisma: any
	) {}

	/**
	 * Build and return an array of entities and/or DTOs containing data to
	 * seed.
	 */
	abstract buildSeed(): Promise<any[]>;

	/**
	 * Saves seed data returned by `buildSeed` method.
	 * @param seederName Name of the seeder.
	 */
	async hydrate(seederName: string, orm: "Prisma" | "TypeORM") {
		const seed = await this.buildSeed();

		try {
			if (orm == "TypeORM") {
				await this.repository.delete({});
				await this.repository.save(seed);
			} else {
				await this.prisma.deleteMany();
				await this.prisma.createMany({ data: seed });
			}
			Logger.log(`√ ${seederName}`);
		} catch (e: any) {
			Logger.error(
				`${seederName} failed: ${
					e.detail ? e.message + " - " + e.detail : e.message
				}`
			);
		}
	}

	/**
	 * Can be invoked to delay the return of `buildSeed` method when a dependent
	 * seeder needs another seeder to complete first.  For example, the User
	 * seeder must be complete for the Session seeder to succeed, because the
	 * User `id` must exist.
	 * @param ms Length of delay in milliseconds.
	 */
	stall(ms: number) {
		return new Promise((resolve) => {
			setTimeout(() => resolve(""), ms);
		});
	}
}

// TODO: turn BaseSeederService into a dynamic module, or function that returns a class as described here: https://youtu.be/jo-1EUxMmxc
