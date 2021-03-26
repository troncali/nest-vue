import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UsersRepository } from "./users.repository";
import { BasicSafeUserDto, FullSafeUserDto } from "../user.dto";
import { User } from "../user.entity";
import { BaseModelService } from "../../base.service";

@Injectable()
export class UsersService extends BaseModelService<User> {
	constructor(
		@InjectRepository(UsersRepository)
		private readonly usersRepo: UsersRepository
	) {
		super();
	}

	async query(
		ids: string | string[],
		fields: (keyof User)[]
	): Promise<Partial<User> | Partial<User>[] | undefined> {
		return await this.getFieldsForIds(
			this.usersRepo,
			ids,
			fields,
			FullSafeUserDto
		);
	}

	async getByIds(
		ids: string | any[]
	): Promise<BasicSafeUserDto | BasicSafeUserDto[]> {
		const users = await this.getOneOrMoreIds(this.usersRepo, ids);
		if (!users) throw new Error("No user found.");
		return await this.usersRepo.transform(BasicSafeUserDto, users);
	}

	// async getFieldsForIds(
	// 	ids: string | string[],
	// 	fields: (keyof User)[]
	// ): Promise<Partial<User> | undefined> {
	// 	const users = await this.getOneOrMoreIds(ids, { select: fields });
	// 	if (!users) throw new Error("No user found.");
	// 	return (await this.usersRepo.transform(
	// 		FullSafeUserDto,
	// 		users
	// 	)) as Partial<User>;
	// }

	// async getOneOrMoreIds(
	// 	ids: string | string[],
	// 	options?: FindOneOptions<User> | FindManyOptions<User>
	// ) {
	// 	return typeof ids === "string"
	// 		? await this.usersRepo.findOne(ids, options)
	// 		: await this.usersRepo.findByIds(ids, options);
	// }
}
