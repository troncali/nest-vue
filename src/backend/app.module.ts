import { Module } from "@nestjs/common";

import { AppConfigModule } from "./config/app/config.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { UsersModule } from "./models/users/users.module";
import { DatabaseProvider } from "./providers/database.provider";
import { GraphQLProvider } from "./providers/graphql.provider";
@Module({
	imports: [AppConfigModule, DatabaseProvider, GraphQLProvider, UsersModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
