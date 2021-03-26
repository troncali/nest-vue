/**
 * TODO: build out folder structure - see NestJS Resource 1
 * TODO: build out model module - see NestJS Resource 2
 * TODO: adjust tsconfig so that ./build/src/backend becomes ./build/backend
 */

import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app/config.service";
import { DockerHandler } from "../lib/docker-handler";

/** Start NestJS server. */
async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			// Set Fastify options: https://www.fastify.io/docs/latest/Server/
			ignoreTrailingSlash: true
		})
	);

	const appConfig: AppConfigService = app.get(AppConfigService);
	app.setGlobalPrefix(`${appConfig.baseRoute}`);

	// Docker requires 0.0.0.0 for host instead of default 'localhost'
	await app.listen(appConfig.port, "0.0.0.0");

	DockerHandler.catchSignals(app);
}
bootstrap();
