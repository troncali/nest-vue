import { forwardRef, Inject } from "@nestjs/common";
import {
	Args,
	Info,
	Parent,
	Query,
	ResolveField,
	Resolver
} from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SessionDto, SessionService } from "@nest-vue/models/session";

import { User } from "../user.entity";
import { UserDto } from "../user.dto";
import { UserService } from "./user.service";

/**
 * GraphQL resolver for `User` entity.
 *
 * @class
 */
@Resolver(() => UserDto)
export class UserResolver {
	/**
	 * Initialize resolver dependencies.
	 * @param userService The injected `UserService` instance.
	 * @param sessionService The injected `SessionService` instance.
	 */
	constructor(
		private userService: UserService,
		@Inject(forwardRef(() => SessionService))
		private sessionService: SessionService
	) {}

	/**
	 * Get a specific set of fields for a `User` by `id`.
	 * @param info The GraphQL `info` object, to identify the requested fields.
	 * @param id The UUID to find.
	 * @returns A `User` record, constrained to exposed `UserDTO` fields.
	 */
	@Query(() => UserDto)
	async user(@Info() info: GraphQLResolveInfo, @Args("id") id: string) {
		const fields = this.userService.getFieldNames(info);
		return await this.userService.query(id, fields);
	}

	/**
	 * Get a specific set of fields for multiple `User`s by `id`.
	 * @param info The GraphQL `info` object, to identify the requested fields.
	 * @param ids An array of UUIDs to find.
	 * @returns An array of `User` records, constrained to exposed `UserDTO`
	 * fields.
	 */
	@Query(() => [UserDto])
	async users(
		@Info() info: GraphQLResolveInfo,
		@Args("ids", { type: () => [String] }) ids: string[]
	): Promise<Partial<User>[]> {
		const fields = this.userService.getFieldNames(info);
		return (await this.userService.query(ids, fields)) as User[];
	}

	/**
	 * Get a specific set of fields for each of the `User`'s active `Session`s.
	 * @param user The resolved parent `User` entity.
	 * @param info The GraphQL `info` object, to identify the requested fields.
	 * @returns A `Session` record, constrained to exposed `SessionDTO` fields.
	 */
	@ResolveField(() => [SessionDto])
	async sessions(@Parent() user: User, @Info() info: GraphQLResolveInfo) {
		const fields = this.sessionService.getFieldNames(info);
		return await this.sessionService.find({
			where: { userDbId: user.dbId },
			select: ["dbId", "id", "userDbId", ...fields]
		});
	}
}
