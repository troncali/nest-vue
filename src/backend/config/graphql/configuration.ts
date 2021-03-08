import { registerAs } from "@nestjs/config";
import { GqlModuleOptions } from "@nestjs/graphql";
import { join } from "path";

// Available configuration options:
// - https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructor

export default registerAs(
	"gql",
	(): GqlModuleOptions => ({
		autoSchemaFile: join(process.cwd(), "src/backend/schema.gql"),
		sortSchema: true
	})
);
