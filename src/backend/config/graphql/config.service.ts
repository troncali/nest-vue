import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";

import { GqlOptionTypes } from "./config.types";

/**
 * Configuration service for default database connection via TypeORM. See
 * options at https://typeorm.io/#/connection-options.
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
			sortSchema: this.sortSchema
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
}
