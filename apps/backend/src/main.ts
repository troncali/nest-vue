import AltairPlugin from "altair-fastify-plugin";
import FastifySecureSession from "@fastify/secure-session";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication
} from "@nestjs/platform-fastify";

import { AppConfigService } from "@nest-vue/nest/config/app";
import { DockerHandler } from "@nest-vue/docker-handler";

import { AppModule } from "./app/app.module";

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
	await app.register(FastifySecureSession, {
		key: [
			DockerHandler.getSecretSync("BACKEND_SESSION_KEY_1", {
				returnType: "buffer"
			})
		],
		cookieName: appConfig.sessionCookieName,
		cookie: {
			httpOnly: true,
			maxAge: 60 * 60 * 24, // expiration in seconds (24 hours)
			sameSite: true,
			secure: true
		}
	});

	await app.register(AltairPlugin, {
		path: "/api/altair",
		baseURL: "/api/altair/",
		endpointURL: "/api/graphql"
	});

	app.setGlobalPrefix(`${appConfig.baseRoute}`);
	app.enableVersioning({ type: VersioningType.URI });

	// Docker requires 0.0.0.0 for host instead of default 'localhost'
	await app.listen(appConfig.port, "0.0.0.0");

	DockerHandler.catchSignals(app);
}
bootstrap();
