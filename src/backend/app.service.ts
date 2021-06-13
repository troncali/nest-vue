import { Injectable } from "@nestjs/common";

/**
 * Base service for the application.
 *
 * @class
 */
@Injectable()
export class AppService {
	/**
	 * Provide a test response.
	 * @returns "Hello World!"
	 */
	async getHello(): Promise<string> {
		return "Hello World!";
	}
}
