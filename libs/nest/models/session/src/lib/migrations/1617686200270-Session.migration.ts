import { Logger } from "@nestjs/common";
import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableUnique
} from "typeorm";

/**
 * Migration service for `Session` entity: create the `session` table.
 *
 * @class
 */
export class Session1617686200270 implements MigrationInterface {
	/**
	 * Initialize migration metadata.
	 * @param name The class name of the migration.
	 */
	constructor(public readonly name: string = "Session1617686200270") {}

	/**
	 * Creates `session` table, if it does not exist, with UUID and creation
	 * date columns, along with a foreign-key for a `User`'s id.
	 * @param queryRunner Reference to instance of TypeORM's queryRunner.
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "session",
				columns: [
					{
						name: "dbId",
						type: "bigint",
						isGenerated: true,
						generationStrategy: "identity",
						isPrimary: true,
						primaryKeyConstraintName: "session_dbId_pkey"
					},
					{
						name: "id",
						type: "uuid",
						isGenerated: true,
						generationStrategy: "uuid"
					},
					{ name: "userDbId", type: "bigint" },
					{
						name: "createdAt",
						type: "timestamp without time zone",
						default: "now()"
					}
				]
			}),
			true
		);
		await queryRunner.createUniqueConstraints("session", [
			new TableUnique({ name: "session_id_key", columnNames: ["id"] })
		]);
		await queryRunner.createForeignKey(
			"session",
			new TableForeignKey({
				name: "user_id_fkey",
				columnNames: ["userDbId"],
				referencedColumnNames: ["dbId"],
				referencedTableName: "user",
				onDelete: "CASCADE"
			})
		);
		Logger.log(`√ ${this.name}: created \`session\` table`);
	}

	/**
	 * Drops the `session` table, if it exists, along with foreign keys and
	 * indicies.
	 * @param queryRunner Reference to instance of TypeORM's queryRunner.
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("session", true, true, true);
		Logger.log(`↺ ${this.name}: dropped \`session\` table`);
	}
}
