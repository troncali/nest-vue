import { Module } from "@nestjs/common";

import { DatabaseProvider } from "./providers/database.provider";
import { GraphQLProvider } from "./providers/graphql.provider";

import { AppConfigModule } from "./config/app/config.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./models/user/user.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
@Module({
	imports: [
		AppConfigModule,
		DatabaseProvider,
		GraphQLProvider,
		UserModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
