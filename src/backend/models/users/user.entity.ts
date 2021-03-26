import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";

// TODO: field-level GraphQL authentication with directives? See https://github.com/LawJolla/prisma-auth0-example/issues/12
// TODO: TypeORM relationships and nested GraphQL handling
// TODO: mutations
/**
 * Complete data structure of the User entity for the database and GraphQL.
 */
@ObjectType()
@Entity()
export class User {
	/** User's UUID. */
	@Field()
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	/** User's email. */
	@Field()
	@Column("text", { unique: true })
	email!: string;

	/**
	 * User's password. Use `@Exclude()` decorator to protect against exposure of sensitive data
	 * if this entity is used as a DTO. Set `@Column()` option `select: false`
	 * to exclude sensitive or uncommon columns from default query. The
	 * repository's `getAllColumnsForIds()` can be used to explicitly include
	 * columns where `select: false` is set.  Alternatively, query only
	 * columns omitted by default by setting query option
	 * `{ select: this.repository.onlyUnselectedColumns() }`.
	 *
	 * @example this.usersRepo.getAllColumnsForIds(id); // includes `password`
	 * this.usersRepo.findOne(id, { select: this.usersRepo.onlyUnselectedColumns() }) // only `password`
	 */
	@Field()
	@Exclude()
	@Column("text", { select: false })
	password!: string;

	/** Date of User's creation in the database. */
	@Field()
	@CreateDateColumn()
	createdAt!: Date;

	/** Date of last update to User's record. */
	@Field()
	@UpdateDateColumn()
	updatedAt!: Date;
}
