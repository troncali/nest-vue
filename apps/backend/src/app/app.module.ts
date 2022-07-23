import { Module } from "@nestjs/common";

import { DatabaseProvider } from "@nest-vue/nest/providers/db";
import { GraphQLProvider } from "@nest-vue/nest/providers/graphql";

import { AppConfigModule } from "@nest-vue/nest/config/app";
import { AuthModule } from "@nest-vue/nest/auth";
import { UserModule } from "@nest-vue/models/user";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [
		AppConfigModule,
		DatabaseProvider,
		GraphQLProvider,
		AuthModule,
		UserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
