import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";

/**
 * Migration service that dispatches database actions.
 *
 * @class
 */
@Injectable()
export class MigrationProvider {
	/**
	 * Initialize migration dependencies.
	 * @param dataSource The TypeORM Connection instance.
	 */
	constructor(private readonly dataSource: DataSource) {}

	/**
	 * Runs all migrations created since the last run.
	 */
	async run() {
		(await this.dataSource.showMigrations())
			? await this.dataSource.runMigrations()
			: Logger.error("No new migrations");
	}

	/**
	 * Reverts only the very last migration file that was run. Repeat to roll
	 * back additional files, one by one.
	 */
	async undo() {
		await this.dataSource.undoLastMigration();
	}
}
