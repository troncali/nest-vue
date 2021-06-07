import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import {
	FastifyAdapter,
	NestFastifyApplication
} from "@nestjs/platform-fastify";
import * as request from "supertest";
import { AppModule } from "@src/backend/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		// For @nestjs/platform-express
		// app = moduleFixture.createNestApplication();

		// For @nestjs/platform-fastify
		app = moduleFixture.createNestApplication<NestFastifyApplication>(
			new FastifyAdapter()
		);
		await app.init();
		await app.getHttpAdapter().getInstance().ready(); // For Fastify
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});
});
