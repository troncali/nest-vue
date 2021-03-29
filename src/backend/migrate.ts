import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { Migrator } from "./providers/migrations/migrators";
import { MigrationProvider } from "./providers/migrations/migration.provider";

/**
 * Start NestJS instance for migrations.
 */
async function bootstrap() {
	const app = await NestFactory.createApplicationContext(Migrator);
	const migrator = app.get(MigrationProvider);
	const arg = process.argv.slice(2);

	// Use command line argument to call `run` or `undo` migration methods.
	const handle = async (
		methodName: "run" | "undo",
		startMessage: string,
		failMessage: string,
		completeMessage: string
	) => {
		Logger.debug(`${startMessage}`);
		await migrator[methodName]().catch((error) => {
			Logger.error(`${failMessage}`);
			throw error;
		});
		Logger.debug(`${completeMessage}`);
	};

	switch (arg[0]) {
		case "undo":
			await handle(
				"undo",
				"Reverting last migration",
				"Rollback failed",
				"Rollback complete"
			);
			break;

		case "run":
		default:
			await handle(
				"run",
				"Running migrations",
				"Migrations failed",
				"Migrations complete"
			);
	}

	app.close();
}
bootstrap();
