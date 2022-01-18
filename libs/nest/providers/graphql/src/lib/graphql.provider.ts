import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { GqlConfigModule } from "@vxnn/nest/config/graphql";
import { GqlConfigService } from "@vxnn/nest/config/graphql";

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			imports: [GqlConfigModule],
			useExisting: GqlConfigService
		})
	]
})
export class GraphQLProvider {}
