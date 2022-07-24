import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Generated,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";

import { BaseModelEntity } from "@nest-vue/models/base-model";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Session, SessionDto } from "@nest-vue/models/session";

// TODO: field-level GraphQL authentication with directives? See https://github.com/LawJolla/prisma-auth0-example/issues/12
// TODO: mutations
// TODO: bundle queries: https://github.com/slaypni/type-graphql-dataloader

/**
 * Complete data structure of the User entity for the database and GraphQL.
 */
@ObjectType()
@Entity()
export class User extends BaseModelEntity {
	/** User's internal (non-public) identfier for the database. */
	@Field()
	@Exclude()
	@Column("bigint")
	@PrimaryGeneratedColumn("identity")
	dbId!: number;

	/** User's unique identfier. */
	@Field()
	@Generated("uuid")
	@Column({ name: "id" })
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
	password?: string;

	/** User's sessions. */
	@Field(() => [SessionDto])
	@OneToMany(() => Session, (session) => session.user, { cascade: true })
	sessions?: SessionDto[];

	/** Date of User's creation in the database. */
	@Field()
	@CreateDateColumn()
	createdAt!: Date;

	/** Date of last update to User's record. */
	@Field()
	@UpdateDateColumn()
	updatedAt!: Date;

	/** Date of User's deletion from the database. */
	@Field()
	@DeleteDateColumn()
	deletedAt?: Date;
}
