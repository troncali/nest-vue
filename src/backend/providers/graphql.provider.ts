import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { GqlConfigModule } from "../config/graphql/config.module";
import { GqlConfigService } from "../config/graphql/config.service";

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			imports: [GqlConfigModule],
			useExisting: GqlConfigService
		})
	]
})
export class GraphQLProvider {}
