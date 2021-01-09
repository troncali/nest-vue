import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// Define interface to prevent references to properties that do not exist
interface AppEnvVars {
	// Full property path is required for nested properties
	// "app.name": string;
	// "app.env": string;
	// "app.url": string;
	"app.port": number;
}

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
	constructor(private configService: ConfigService<AppEnvVars>) {}

	// get name(): string {
	// 	return this.configService.get<string>("app.name");
	// }
	// get env(): string {
	// 	return this.configService.get<string>("app.env");
	// }
	// get url(): string {
	// 	return this.configService.get<string>("app.url");
	// }
	get port(): number {
		return Number(this.configService.get<number>("app.port"));
	}
}
