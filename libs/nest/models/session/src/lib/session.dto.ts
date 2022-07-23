import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BasicUserDto, UserDto } from "@nest-vue/models/user";

/** DTO for storing session and user details in an encrypted cookie. */
@ObjectType()
export class UserSessionDto extends BasicUserDto {
	/** UUID of the user's current session. */
	@Expose() @Field() sessionId!: string;
}
@ObjectType()
export class UserSession extends UserSessionDto {
	/** UUID of the user's current session. */
	@Field() sessionDbId!: number;
}

/** DTO for transferring all safe (non-sensitive) session details. */
@ObjectType()
export class SessionDto {
	/** Session's UUID. */
	@Expose() @Field() id!: string;
	/** Date of Session's creation in the database. */
	@Expose() @Field() createdAt!: Date;
	/** Session's associated User entity. */
	@Expose() @Field() user!: UserDto;
	/** User's UUID. */
	@Expose() @Field() userDbId!: number;
}

/** DTO for transferring all safe (non-sensitive) session details. */
@ObjectType()
export class SessionSeed {
	/** Session's UUID. */
	@Expose() @Field() id!: string;
	/** Date of Session's creation in the database. */
	@Expose() @Field() createdAt!: Date;
	/** User's UUID. */
	@Expose() @Field() userDbId!: number;
}
