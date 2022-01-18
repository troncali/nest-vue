import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";

import { Seeders } from "@vxnn/nest/providers/seeders";
import { SeedProvider } from "@vxnn/nest/providers/seeders";

/**
 * Start NestJS instance for seeding data.
 */
async function bootstrap() {
	const app = await NestFactory.createApplicationContext(Seeders);
	const seeder = app.get(SeedProvider);

	Logger.debug("Seeding");

	await seeder.seed().catch((error) => {
		Logger.error("Seeding failed");
		throw error;
	});

	Logger.debug("Seeding complete");

	app.close();
}
bootstrap();
