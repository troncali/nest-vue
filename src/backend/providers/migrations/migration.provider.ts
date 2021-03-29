import { User } from "@/backend/models/users/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { Connection } from "typeorm";

/**
 * Migration service that dispatches database actions.
 *
 * @class
 */
@Injectable()
export class MigrationProvider {
	constructor(private readonly connection: Connection) {}

	/**
	 * Runs all migrations created since the last run.
	 */
	async run() {
		(await this.connection.showMigrations())
			? await this.connection.runMigrations()
			: Logger.error("No new migrations");
	}

	/**
	 * Reverts only the very last migration file that was run. Repeat to roll
	 * back additional files, one by one.
	 */
	async undo() {
		await this.connection.undoLastMigration();
	}
}
