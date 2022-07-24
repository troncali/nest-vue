import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SessionDto } from "@nest-vue/models/session";

// TODO: Implement data validation (removed class-validator, which wasn't hooked up and has an unresolved vulnerability)

/** Unsafe DTO to server with user email and password to create a new user. */
export class CreateUserDto {
	/** User's email. */
	email!: string;
	/** User's initial, unencrypted password from registration form. */
	password!: string;
}

/** DTO for transfering basic user details. */
@ObjectType()
export class BasicUserDto {
	/** User's UUID. */
	@Expose() @Field() id!: string;
	/** User's email. */
	@Expose() @Field() email!: string;
}

/** DTO for transfering all safe (non-sensitive) user details. */
@ObjectType()
export class UserDto extends BasicUserDto {
	/** Date of User's creation in the database. */
	@Expose() @Field() createdAt!: Date;
	/** Date of last update to User's record. */
	@Expose() @Field() updatedAt!: Date;
	/** User's sessions. */
	@Expose() @Field(() => [SessionDto]) sessions?: SessionDto[];
}

/** DTO to server with asserted user email and password for login. */
export class LoginUserDto {
	/** The asserted `User` email from login form. */
	readonly email!: string;
	/** The asserted `User` password from login form. */
	readonly password!: string;
}
