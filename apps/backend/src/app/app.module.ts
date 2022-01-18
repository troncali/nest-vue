import { Module } from "@nestjs/common";

import { DatabaseProvider } from "@vxnn/nest/providers/db";
import { GraphQLProvider } from "@vxnn/nest/providers/graphql";

import { AppConfigModule } from "@vxnn/nest/config/app";
import { AuthModule } from "@vxnn/nest/auth";
import { UserModule } from "@vxnn/models/user";

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
