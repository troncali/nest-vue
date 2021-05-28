import { registerAs } from "@nestjs/config";
import { GqlModuleOptions } from "@nestjs/graphql";
import { join } from "path";

/**
 * Available configuration options:
 * - https://docs.nestjs.com/graphql/quick-start
 * - https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructor
 */
export default registerAs(
	"gql",
	(): GqlModuleOptions => ({
		autoSchemaFile: join(process.cwd(), "src/backend/schema.gql"),
		sortSchema: true,
		path: `${process.env.BACKEND_BASE_ROUTE}/${process.env.GRAPHQL_PATH}`
	})
);
