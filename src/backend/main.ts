import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app/config.service";
import { DockerHandler } from "@libs/docker-handler";

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

	/**
	 * Session options: https://github.com/fastify/fastify-secure-session.
	 * Fastify recommends using only up to two session keys at a time, with
	 * the newest listed first. To generate a key, run `yarn run
	 * secure-session-gen-key > FILENAME`, which will save a buffer to file.
	 * A session secret and salt can be used in place of a key.
	 */
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	await app.register(require("fastify-secure-session"), {
		key: [
			DockerHandler.getSecretSync("BACKEND_SESSION_KEY_1", {
				returnType: "buffer"
			})
		],
		cookieName: "session",
		cookie: { httpOnly: true, sameSite: true, secure: true }
	});

	app.setGlobalPrefix(`${appConfig.baseRoute}`);
	// Docker requires 0.0.0.0 for host instead of default 'localhost'
	await app.listen(appConfig.port, "0.0.0.0");

	DockerHandler.catchSignals(app);
}
bootstrap();
