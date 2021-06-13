import { Module } from "@nestjs/common";

import { AppConfigModule } from "./config/app/config.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { DatabaseProvider } from "./providers/database.provider";
import { GraphQLProvider } from "./providers/graphql.provider";

import { UserModule } from "./models/user/user.module";
import { SessionModule } from "./models/session/session.module";

@Module({
	imports: [
		AppConfigModule,
		DatabaseProvider,
		GraphQLProvider,
		UserModule,
		SessionModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
