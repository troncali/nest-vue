import { Injectable } from "@nestjs/common";
import * as Faker from "faker";

import { BaseSeederService } from "../../base.seeder.service";
import { UsersRepository } from "../providers/users.repository";
import { User } from "../user.entity";
import { CreateUserDto } from "../user.dto";

/**
 * Establish methods specific to the User seeder.
 */
@Injectable()
export class UsersSeederService extends BaseSeederService<
	User,
	UsersRepository
> {
	constructor(public readonly repository: UsersRepository) {
		super(repository);
	}

	async buildSeed() {
		let staticUser1 = new User();
		staticUser1 = {
			id: "d3f6bcef-b1c6-4e54-a473-7d710f88c9d2",
			email: "user1@example.com",
			password: "testing",
			createdAt: new Date(),
			updatedAt: new Date()
		};

		let staticUser2 = new User();
		staticUser2 = {
			id: "31a16647-5a2b-46ad-9974-39c950d86547",
			email: "user2@example.com",
			password: "testing2",
			createdAt: new Date(),
			updatedAt: new Date()
		};

		let randomUser = new CreateUserDto();
		randomUser = {
			email: Faker.internet.email(),
			password: Faker.internet.password()
		};

		return [staticUser1, staticUser2, randomUser];
	}
}
