import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { Seeders, SeedProvider } from "@nest-vue/nest/providers/seeders";

/**
 * Start NestJS instance for seeding data.
 */
async function bootstrap() {
	const app = await NestFactory.createApplicationContext(Seeders);
	const seeder = app.get(SeedProvider);

	// Use the command line to specify which ORM will seed data
	const orm = process.argv.slice(2)[0] == "prisma" ? "Prisma" : "TypeORM";

	Logger.debug(`Seeding with ${orm}`);

	await seeder.seed(orm).catch((error: any) => {
		Logger.error("Seeding failed");
		throw error;
	});

	Logger.debug("Seeding complete");

	app.close();
}
bootstrap();
