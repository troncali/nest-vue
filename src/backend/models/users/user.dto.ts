import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty() @IsEmail() email!: string;
	@IsNotEmpty() password!: string;
}

@ObjectType()
export class BasicSafeUserDto {
	@Expose() @Field() id!: string;
	@Expose() @Field() email!: string;
}

@ObjectType()
export class FullSafeUserDto extends BasicSafeUserDto {
	@Expose() @Field() createdAt!: Date;
	@Expose() @Field() updatedAt!: Date;
}

export class LoginUserDto {
	@IsNotEmpty() readonly email!: string;
	@IsNotEmpty() readonly password!: string;
}
