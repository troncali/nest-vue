import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

/** Base app-related routing, prefixed with `/{BACKEND_BASE_PATH}/` */
@Controller()
export class AppController {
	/**
	 * Initialize controller dependencies.
	 * @param appService The injected `AppService` instance.
	 */
	constructor(private readonly appService: AppService) {}

	/**
	 * Get a test route: `/`
	 */
	@Get()
	async getHello(): Promise<string> {
		return this.appService.getHello();
	}
}
