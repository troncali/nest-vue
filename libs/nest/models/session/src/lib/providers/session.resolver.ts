/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Args,
	Info,
	Parent,
	Query,
	ResolveField,
	Resolver
} from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { UserService } from "@vxnn/models/user";
import { UserDto } from "@vxnn/models/user";
import { SessionDto } from "../session.dto";

import { Session } from "../session.entity";
import { SessionService } from "./session.service";
import { forwardRef, Inject } from "@nestjs/common";

/**
 * GraphQL resolver for `Session` entity.
 *
 * @class
 */
@Resolver(() => SessionDto)
export class SessionResolver {
	/**
	 * Initialize resolver dependencies.
	 * @param sessionService The injected `SessionService` instance.
	 * @param userService The injected `UserService` instance.
	 */
	constructor(
		private sessionService: SessionService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService
	) {}

	/**
	 * Get a specific set of fields for a `Session` by `id`.
	 * @param info The GraphQL `info` object, to identify the requested fields.
	 * @param id The UUID to find.
	 * @returns A `Session` record, constrained to exposed `SessionDTO` fields.
	 */
	@Query((returns) => SessionDto)
	async session(@Info() info: GraphQLResolveInfo, @Args("id") id: string) {
		const fields = this.sessionService.getFieldNames(info);
		return await this.sessionService.query(id, ["id", "userId", ...fields]);
	}

	/**
	 * Get a specific set of fields for multiple `Session`s by `id`.
	 * @param info The GraphQL `info` object, to identify the requested fields.
	 * @param ids An array of UUIDs to find.
	 * @returns An array of `Session` records, constrained to exposed
	 * `SessionDTO` fields.
	 */
	@Query((returns) => [SessionDto])
	async sessions(
		@Info() info: GraphQLResolveInfo,
		@Args("ids", { type: () => [String] }) ids: string[]
	) {
		const fields = this.sessionService.getFieldNames(info);
		return (await this.sessionService.query(ids, [
			"id",
			"userId",
			...fields
		])) as SessionDto[];
	}

	/**
	 * Get a specific set of fields for the `Session`'s `User`.
	 * @param user The resolved parent `Session` entity.
	 * @param info The GraphQL `info` object, to identify the requested fields.
	 * @returns A `User` record, constrained to exposed `UserDTO` fields.
	 */
	@ResolveField(() => UserDto)
	async user(@Parent() session: Session, @Info() info: GraphQLResolveInfo) {
		const fields = this.userService.getFieldNames(info);
		return await this.userService.query(session.userId, fields);
	}
}
