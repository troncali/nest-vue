import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";

import { GqlOptionTypes } from "./config.types";

/**
 * Configuration service for GraphQL. See options available options at
 * - https://docs.nestjs.com/graphql/quick-start
 * - https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructor.
 *
 * @class
 */
@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
	constructor(private configService: ConfigService<GqlOptionTypes>) {}

	/** Generate the full GraphQL configuration object. */
	createGqlOptions(): GqlModuleOptions {
		return {
			autoSchemaFile: this.autoSchemaFile,
			sortSchema: this.sortSchema,
			path: this.path
		};
	}

	/** Path where automatically generated schema will be created. */
	get autoSchemaFile(): GqlModuleOptions["autoSchemaFile"] {
		return this.configService.get("gql.autoSchemaFile");
	}

	/** Whether to sort schema lexicographically. */
	get sortSchema(): GqlModuleOptions["sortSchema"] {
		return this.configService.get("gql.sortSchema");
	}

	/**
	 * Route at which GraphQL will be accessed
	 * @example path=gql : GraphQL route will be https://localhost/basePath/gql
	 */
	get path(): GqlModuleOptions["path"] {
		return this.configService.get("gql.path");
	}
}
