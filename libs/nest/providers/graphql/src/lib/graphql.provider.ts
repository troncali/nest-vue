import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";

import {
	GqlConfigModule,
	GqlConfigService
} from "@nest-vue/nest/config/graphql";

@Module({
	imports: [
		GraphQLModule.forRootAsync<MercuriusDriverConfig>({
			driver: MercuriusDriver,
			imports: [GqlConfigModule],
			useExisting: GqlConfigService
		})
	]
})
export class GraphQLProvider {}
