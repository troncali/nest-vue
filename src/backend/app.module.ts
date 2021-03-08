import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./config/app/config.module";
import { DbConfigModule } from "./config/db/config.module";
import { DefaultDbConfigService } from "./config/db/default-postgres/config.service";
import { GqlConfigModule } from "./config/graphql/config.module";
import { GqlConfigService } from "./config/graphql/config.service";
@Module({
	imports: [
		AppConfigModule,
		GraphQLModule.forRootAsync({
			imports: [GqlConfigModule],
			useExisting: GqlConfigService
		}),
		TypeOrmModule.forRootAsync({
			imports: [DbConfigModule],
			useExisting: DefaultDbConfigService
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
