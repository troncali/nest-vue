import { Field, ObjectType } from "@nestjs/graphql";
import { Expose } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import { UserDto } from "../user/user.dto";
import { User } from "../user/user.entity";

/**
 * Complete data structure of the Session entity for the database and GraphQL.
 */
@ObjectType()
@Entity()
export class Session {
	/** Session's UUID. */
	@Expose()
	@Field()
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	/** Session's associated User entity. */
	@Expose()
	@Field(() => UserDto)
	@ManyToOne(() => User, (user) => user.sessions)
	user?: UserDto;

	/** User's UUID. */
	@Expose()
	@Field()
	@Column()
	userId!: string;

	/** Date of Session's creation in the database. */
	@Expose()
	@Field()
	@CreateDateColumn()
	createdAt!: Date;
}

// TODO: Track more session details like IP, device, location
