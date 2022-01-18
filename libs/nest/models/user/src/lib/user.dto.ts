import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { SessionDto } from "@vxnn/models/session";

/** Unsafe DTO to server with user email and password to create a new user. */
export class CreateUserDto {
	/** User's email. */
	@IsNotEmpty() @IsEmail() email!: string;
	/** User's initial, unencrypted password from registration form. */
	@IsNotEmpty() password!: string;
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
	@IsNotEmpty() readonly email!: string;
	/** The asserted `User` password from login form. */
	@IsNotEmpty() readonly password!: string;
}
