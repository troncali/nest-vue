import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UserRepository } from "./user.repository";
import { BasicUserDto, UserDto } from "../user.dto";
import { User } from "../user.entity";
import { BaseModelService } from "../../base.service";

/**
 * Model service for `User` entity.
 *
 * @class
 */
@Injectable()
export class UserService extends BaseModelService<User> {
	/**
	 * Initialize service dependencies.
	 * @param userRepo The injected `UserRepository` instance.
	 */
	constructor(private readonly userRepo: UserRepository) {
		super();
	}

	/**
	 * Get a specific set of fields for one or more `User` UUIDs.
	 * @param ids One or more UUIDs to find.
	 * @param fields Fields of the `User` entity to include in response.
	 * @example sessionService.query(id, ["email"])
	 * @returns A single `User` record, or an array of `User` records,
	 * constrained to exposed `UserDto` fields.
	 */
	async query(
		ids: string | string[],
		fields: (keyof User)[]
	): Promise<Partial<User> | Partial<User>[] | undefined> {
		return await this.getFieldsForIds(this.userRepo, ids, fields, UserDto);
	}

	/**
	 * Get a basic `User` record.
	 * @param ids One or more UUIDs to find.
	 * @returns A single `User` record, or an array of `User` records,
	 * constrained to exposed `BasicUserDto` fields.
	 */
	async getByIds(
		ids: string | string[]
	): Promise<BasicUserDto | BasicUserDto[]> {
		const users = await this.getOneOrMoreIds(this.userRepo, ids);
		if (!users) throw new Error("No user found.");
		return await this.userRepo.transform(BasicUserDto, users);
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
