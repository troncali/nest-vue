import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("v1")
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	async getHello(): Promise<string> {
		return this.appService.getHello();
	}
}
