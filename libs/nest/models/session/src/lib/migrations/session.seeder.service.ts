import { PrismaService } from "@libs/nest/providers/db/src/lib/prisma/default.service";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BaseSeederService } from "@nest-vue/models/base-model";
import { Repository } from "typeorm";
import { Session } from "../session.entity";

/**
 * Seeder service for `Session` entity.
 *
 * @class
 */
@Injectable()
export class SessionSeederService extends BaseSeederService<Session> {
	/**
	 * Initialize seeder dependencies.
	 * @param repository The injected `Session` repository instance.
	 */
	constructor(
		@InjectRepository(Session)
		public readonly repository: Repository<Session>,
		prisma: PrismaService
	) {
		super(repository, prisma.session);
	}

	/**
	 * Build the `Session` data to seed. Use negative integers for primary IDs
	 * to avoid autoincrement collision.
	 * @returns An array of entities and/or DTOs containing data to seed.
	 */
	async buildSeed() {
		let staticSession1 = new Session();
		staticSession1 = {
			dbId: -1,
			id: "c6ad267e-1755-414e-9402-0a83c149f1ac",
			userDbId: -1,
			createdAt: new Date()
		};

		let staticSession2 = new Session();
		staticSession2 = {
			dbId: -2,
			id: "489bbd01-9c12-426a-a090-1a86a6859921",
			userDbId: -2,
			createdAt: new Date()
		};

		await this.stall(50);
		return [staticSession1, staticSession2];
	}
}
