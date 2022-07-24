# Backend Configuration

Settings are organized into library modules that follow Nest's [namespace](https://docs.nestjs.com/techniques/configuration#configuration-namespaces) and [custom configuration file](https://docs.nestjs.com/techniques/configuration#custom-configuration-files) pattern.

## Module Structure

Configuration modules are located in `libs/nest/config/[namespace]` and have the following files:

<CodeGroup>
<CodeGroupItem title="config.module.ts">

```js
// Provides the configuration and validation schema to Nest's ConfigModule.
// Exports a service for accessing configuration values.

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			cache: true,
			validationSchema: validationSchema
		})
	],
	providers: [ConfigService, NamespaceConfigService],
	exports: [ConfigService, NamespaceConfigService]
})
export class NamespaceConfigModule {}
```

</CodeGroupItem>
<CodeGroupItem title="config.service.ts">

```js
// Wrapper service for accesing namespaced configuration values

@Injectable()
export class NamespaceConfigService {
	constructor(private configService: ConfigService<NamespaceTypes>) {}

	get configValue(): string | undefined {
		return this.configService.get<string>("namespace.configValue");
	}
}
```

</CodeGroupItem>
<CodeGroupItem title="config.types.ts">

```ts
// Defines configuration types for type checking and intellisense.

export interface NamespaceTypes {
	/** Property description. */
	"namespace.configValue": string;
}
```

</CodeGroupItem>
<CodeGroupItem title="config.validation.ts">

```ts
// Joi object passed to Nest's ConfigModule for built-in validation
// of environment variables used in the configuration.

export default Joi.object({
	ENV_CONFIG_VALUE: Joi.string().required()
});
```

</CodeGroupItem>
<CodeGroupItem title="configuration.ts">

```ts
// Sets the configuration values.

export default registerAs("namespace", () => ({
	configValue: process.env.ENV_CONFIG_VALUE
}));
```

</CodeGroupItem>
</CodeGroup>

Namespaced configuration modules are imported into feature modules, and values are accessed through the namespaced configuration service:

<CodeGroup>
<CodeGroupItem title="feature.module.ts">

```ts
@Module({
	imports: [NamespaceConfigModule],
	controllers: [FeatureController]
})
export class FeatureModule {}
```

</CodeGroupItem>
<CodeGroupItem title="feature.controller.ts">

```ts
export class FeatureController {
	constructor(private readonly namespaceConfig: NamespaceConfigService) {}

	@Get("feature")
	async feature() {
		return this.namespaceConfig.configValue;
	}
}
```

</CodeGroupItem>
</CodeGroup>

Additional configuration modules can be added by using `nx` to [generate a Nest library](nx.md) that implements this structure. The default configuration modules are described below.

## Application

`AppConfigModule` provides base application configuration values namespaced under `app` in Nest's ConfigService. Values are accessible through the `AppConfigService`.

| Accessor            | Value      | Description                                                                     |
| :------------------ | :--------- | :------------------------------------------------------------------------------ |
| env                 | `NODE_ENV` | Environment in which the applicaiton is running.                                |
| port                | 3001       | Port on which the application is listening. Uses `BACKEND_PORT` from `.env`.    |
| baseRoute           | /api       | Global route prefix for the application. Uses `BACKEND_BASE_ROUTE` from `.env`. |
| sessionCookieName   | session    | Name of the cookie in which encrypted session data is stored.                   |
| sessionUserProperty | user       | Property on the session object where authenticated user data is stored.         |

## Database

`DbConfigModule` provides database configuration values namespaced under `db` in Nest's ConfigService. Values are accessible through the `DefaultDbConfigService`. Base connection details are managed in `src/lib/connection.ts`, [including connection URLs used by Prisma](#prisma).

A PostgreSQL configuration is implemented as the default database connection. A MongoDB configuration is also provided and can be used instead by changing `DefaultDbConfigService` and `configuration` on lines 4-5 of `config.module.ts` to import from the `src/lib/default-mongo` directory instead of `src/lib/default-postgres`. Other database connections [supported by Prisma](#prisma) and [TypeORM](#typeorm) can be implemented using a similar structure.

| Accessor         | Value                    | Description                                                                    |
| :--------------- | :----------------------- | :----------------------------------------------------------------------------- |
| type             | `postgres` or `mongodb`  | Type of database.                                                              |
| name             | default                  | Name of the database connection.                                               |
| host             | `localhost` or `DB_HOST` | Database host. `DB_HOST` from `.env` is used if running in a docker container. |
| port             | `5432`                   | Database port. Uses `DB_PORT` from `.env`.                                     |
| username         | `DB_USERNAME`            | Database user. Uses the `DB_USERNAME` docker secret.                           |
| password         | `DB_PASSWORD`            | Database password. Uses the `DB_PASSWORD` docker secret.                       |
| database         | main                     | Database name that will be the target of operations.                           |
| schema           | public                   | For PostgreSQL only. Database schema that will be the target of operations.    |
| autoLoadEntities | `true`                   | Whether TypeORM should automatically load entities.                            |
| migrations       | _various_                | TypeORM migrations to load for `MigrationProvider`.                            |

## GraphQL

`GqlConfigModule` provides GraphQL configuration values namespaced under `gql` in Nest's ConfigService. Values are accessible through the `GqlConfigService`.

| Accessor       | Value                   | Description                                                                                        |
| :------------- | :---------------------- | :------------------------------------------------------------------------------------------------- |
| autoSchemaFile | apps/backend/schema.gql | Path where automatically generated GraphQL schema will be created.                                 |
| sortSchema     | true                    | Whether to sort schema lexicographically.                                                          |
| path           | /api/graphql            | Route at which GraphQL will be accessed. Uses `BACKEND_BASE_ROUTE` and `GRAPHQL_PATH` from `.env`. |
