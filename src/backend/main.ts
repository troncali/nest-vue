/* https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401
 * https://medium.com/the-crowdlinker-chronicle/best-way-to-inject-repositories-using-typeorm-nestjs-e134c3dbf53c
 */

import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter()
	);
	await app.listen(3000);
}
bootstrap();
