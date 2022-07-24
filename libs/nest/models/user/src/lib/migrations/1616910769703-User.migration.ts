import { MigrationInterface, QueryRunner, Table, TableUnique } from "typeorm";
import { Logger } from "@nestjs/common";

/**
 * Migration service for `User` entity: create the `user` table.
 *
 * @class
 */
export class User1616910769703 implements MigrationInterface {
	/**
	 * Initialize migration metadata.
	 * @param name The class name of the migration.
	 */
	constructor(public readonly name: string = "User1616910769703") {}

	/**
	 * Creates `user` table, if it does not exist, with UUID, email, password,
	 * and date metadata columns.
	 * @param queryRunner Reference to instance of TypeORM's queryRunner.
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "user",
				columns: [
					{
						name: "dbId",
						type: "bigint",
						isGenerated: true,
						generationStrategy: "identity",
						isPrimary: true,
						primaryKeyConstraintName: "user_dbId_pkey"
					},
					{
						name: "id",
						type: "uuid",
						isGenerated: true,
						generationStrategy: "uuid"
					},
					{ name: "email", type: "text" },
					{ name: "password", type: "text" },
					{
						name: "createdAt",
						type: "timestamp without time zone",
						default: "now()"
					},
					{
						name: "updatedAt",
						type: "timestamp without time zone",
						default: "now()"
					},
					{
						name: "deletedAt",
						type: "time without time zone",
						isNullable: true
					}
				]
			}),
			true
		);
		await queryRunner.createUniqueConstraints("user", [
			new TableUnique({ name: "user_id_key", columnNames: ["id"] }),
			new TableUnique({ name: "user_email_key", columnNames: ["email"] })
		]);
		Logger.log(`√ ${this.name}: created \`user\` table`);
	}

	/**
	 * Drops the `user` table, if it exists, along with foreign keys and
	 * indicies.
	 * @param queryRunner Reference to instance of TypeORM's queryRunner.
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("user", true, true, true);
		Logger.log(`↺ ${this.name}: dropped \`user\` table`);
	}
}
