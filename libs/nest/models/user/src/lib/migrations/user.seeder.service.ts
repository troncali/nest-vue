import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";
import { Repository } from "typeorm";

import { BaseSeederService } from "@nest-vue/models/base-model";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PrismaService } from "@libs/nest/providers/db/src/lib/prisma/default.service";

import { CreateUserDto } from "../user.dto";
import { User } from "../user.entity";

/**
 * Seeder service for `User` entity.
 *
 * @class
 */
@Injectable()
export class UserSeederService extends BaseSeederService<User> {
	/**
	 * Initialize seeder dependencies.
	 * @param repository The injected `User` repository instance.
	 */
	constructor(
		@InjectRepository(User) readonly repository: Repository<User>,
		prisma: PrismaService
	) {
		super(repository, prisma.user);
	}

	/**
	 * Build the `User` data to seed. Use negative integers for primary IDs to
	 * avoid autoincrement collision.
	 * @returns An array of entities and/or DTOs containing data to seed.
	 */
	async buildSeed() {
		let staticUser1 = new User();
		staticUser1 = {
			dbId: -1,
			id: "d3f6bcef-b1c6-4e54-a473-7d710f88c9d2",
			email: "user1@example.com",
			password: "testing",
			createdAt: new Date(),
			updatedAt: new Date()
		};

		let staticUser2 = new User();
		staticUser2 = {
			dbId: -2,
			id: "31a16647-5a2b-46ad-9974-39c950d86547",
			email: "user2@example.com",
			password: "testing2",
			createdAt: new Date(),
			updatedAt: new Date()
		};

		let randomUser: CreateUserDto & { updatedAt?: Date } =
			new CreateUserDto();
		randomUser = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			updatedAt: new Date()
		};

		return [staticUser1, staticUser2, randomUser];
	}
}
