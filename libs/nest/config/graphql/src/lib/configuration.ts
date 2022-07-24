import { registerAs } from "@nestjs/config";
import { MercuriusDriverConfig } from "@nestjs/mercurius";
import { join } from "path";

/**
 * Available configuration options:
 * - https://docs.nestjs.com/graphql/quick-start
 * - https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructor
 */
export default registerAs(
	"gql",
	(): MercuriusDriverConfig => ({
		autoSchemaFile: join(process.cwd(), "apps/backend/schema.gql"),
		sortSchema: true,
		path: `${process.env.BACKEND_BASE_ROUTE}/${process.env.GRAPHQL_PATH}`,
		graphiql: false,
		ide: false,
		jit: 1
	})
);
