import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { BasicUserDto, UserDto } from "@vxnn/models/user";

/** DTO for storing session and user details in an encrypted cookie. */
@ObjectType()
export class UserSession extends BasicUserDto {
	/** UUID of the user's current session. */
	@Expose() @Field() sessionId!: string;
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
	@Expose() @Field() userId!: string;
}
