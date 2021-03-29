import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { Logger } from "@nestjs/common";

/**
 * Migration: initial `user` table.
 */
export class Users1616910769703 implements MigrationInterface {
	constructor(public readonly name: string = "Users1616910769703") {}

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
		Logger.log(`√ ${this.name}: created \`users\` table`);
	}

	/**
	 * Drops the `user` table, if it exists, along with foreign keys and
	 * indicies.
	 * @param queryRunner Reference to instance of TypeORM's queryRunner.
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("user", true, true, true);
		Logger.log(`↺ ${this.name}: dropped \`users\` table`);
	}
}
