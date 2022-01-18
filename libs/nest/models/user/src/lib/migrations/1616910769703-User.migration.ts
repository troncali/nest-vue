import { MigrationInterface, QueryRunner, Table } from "typeorm";
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
						name: "id",
						type: "uuid",
						isGenerated: true,
						generationStrategy: "uuid",
						isPrimary: true,
						isUnique: true
					},
					{ name: "email", type: "text", isUnique: true },
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
