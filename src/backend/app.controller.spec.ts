import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "@/backend/app.controller";
import { AppService } from "@/backend/app.service";

describe("AppController", () => {
	let appController: AppController;
	// let appService: AppService;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService]
		}).compile();

		// appService = app.get<AppService>(AppService);
		appController = app.get<AppController>(AppController);
	});

	describe("root", () => {
		it('should return "Hello World!"', async () => {
			// Mocking a provider
			// const result = new Promise<string>((resolve, _) =>
			// 	resolve("Hello World!")
			// );
			// jest.spyOn(appService, "getHello").mockImplementation(() => result);

			expect(await appController.getHello()).toBe("Hello World!");
		});
	});
});
