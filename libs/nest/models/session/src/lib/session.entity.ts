import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude, Expose } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	Entity,
	Generated,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { User, UserDto } from "@nest-vue/models/user";

/**
 * Complete data structure of the Session entity for the database and GraphQL.
 */
@ObjectType()
@Entity()
export class Session {
	/** Session's internal (non-public) identfier for the database. */
	@Field()
	@Exclude()
	@Column("bigint")
	@PrimaryGeneratedColumn("identity")
	dbId!: number;

	/** Session's UUID. */
	@Expose()
	@Field()
	@Generated("uuid")
	@Column({ name: "id" })
	id!: string;

	/** Session's associated User entity. */
	@Expose()
	@Field(() => UserDto)
	@ManyToOne(() => User, (user) => user.sessions)
	user?: UserDto;

	/** The database identifier of the User associated with this Session. */
	@Expose()
	@Field()
	@Column("bigint")
	userDbId!: number;

	/** Date of Session's creation in the database. */
	@Expose()
	@Field()
	@CreateDateColumn()
	createdAt!: Date;
}

// TODO: Track more session details like IP, device, location
