/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Info, Query, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { BasicSafeUserDto, FullSafeUserDto } from "../user.dto";

import { User } from "../user.entity";
import { UsersService } from "./users.service";

@Resolver((of: void) => User)
export class UsersResolver {
	constructor(private usersService: UsersService) {}

	// TODO: Test with nested fields
	@Query((returns) => FullSafeUserDto)
	async user(@Info() info: GraphQLResolveInfo, @Args("id") id: string) {
		const fields = this.usersService.getFieldNames(info);
		return await this.usersService.query(id, fields);
	}

	@Query((returns) => [FullSafeUserDto])
	async users(
		@Info() info: GraphQLResolveInfo,
		@Args("ids", { type: () => [String] }) ids: string[]
	): Promise<Partial<User>[]> {
		const fields = this.usersService.getFieldNames(info);
		return (await this.usersService.query(ids, fields)) as User[];
	}

	// @Query((returns) => BasicSafeUserDto as Partial<User>, {
	// 	name: "BasicUser"
	// })
	// async basicUser(@Args("id", { type: () => String }) id: string) {
	// 	return this.usersService.getByIds(id);
	// }
}
