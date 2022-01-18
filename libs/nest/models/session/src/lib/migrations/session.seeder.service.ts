import { Injectable } from "@nestjs/common";

import { BaseSeederService } from "@vxnn/models/base-model";
import { SessionRepository } from "../providers/session.repository";
import { Session } from "../session.entity";

/**
 * Seeder service for `Session` entity.
 *
 * @class
 */
@Injectable()
export class SessionSeederService extends BaseSeederService<
	Session,
	SessionRepository
> {
	/**
	 * Initialize seeder dependencies.
	 * @param repository The injected `SessionRepository` instance.
	 */
	constructor(public readonly repository: SessionRepository) {
		super(repository);
	}

	/**
	 * Build the `Session` data to seed.
	 * @returns An array of entities and/or DTOs containing data to seed.
	 */
	async buildSeed() {
		let staticSession1 = new Session();
		staticSession1 = {
			id: "c6ad267e-1755-414e-9402-0a83c149f1ac",
			userId: "d3f6bcef-b1c6-4e54-a473-7d710f88c9d2",
			createdAt: new Date()
		};

		let staticSession2 = new Session();
		staticSession2 = {
			id: "489bbd01-9c12-426a-a090-1a86a6859921",
			userId: "31a16647-5a2b-46ad-9974-39c950d86547",
			createdAt: new Date()
		};

		await this.stall(50);
		return [staticSession1, staticSession2];
	}
}
