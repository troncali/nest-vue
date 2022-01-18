import { Injectable } from "@nestjs/common";

import { UserRepository } from "./user.repository";
import { BasicUserDto, UserDto } from "../user.dto";
import { User } from "../user.entity";
import { BaseModelService } from "@vxnn/models/base-model";
import { CipherProvider } from "@vxnn/nest/providers/cipher";

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
	 * @param cipherProvider The injected `CipherProvider` instance.
	 */
	constructor(
		private readonly userRepo: UserRepository,
		private readonly cipherProvider: CipherProvider
	) {
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

	/**
	 * For authentication only, get a full `User` record by email. Includes
	 * encrypted password.
	 * @param email The `User`'s email.
	 * @returns A single `User` record.
	 */
	async getUserForAuth(email: string): Promise<User | undefined> {
		return await this.userRepo.findOne({
			where: { email },
			select: this.userRepo.allColumns()
		});
	}

	/**
	 * Create a `User` record.
	 * @param email The `User`'s email.
	 * @param password The `User`'s initial, unencrypted password from
	 * registration form.
	 * @returns A `User` record.
	 */
	async create(email: string, password: string) {
		const hash = await this.cipherProvider.oneWayHash(password);
		return await this.userRepo.save({ email, password: hash });
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
