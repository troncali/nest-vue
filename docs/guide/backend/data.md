# Backend Data Access

The `DatabaseProvider` is configured so that both Prisma and TypeORM can be used together, but either could be removed in favor of the other. Both support multiple database types; default implementations for PostgreSQL and MongoDB are included. Below are benefits and drawbacks for each followed by explanations of how each is implemented.

|                                 | Benefits                                                  | Drawbacks                                                |
| :------------------------------ | :-------------------------------------------------------- | :------------------------------------------------------- |
| [Prisma](https://www.prisma.io) | Modern and actively deveoped. Solid documentation.        | No MongoDb migration support. Fewer databases supported. |
| [TypeORM](https://typeorm.io)   | Tightly integrated with NestJS. More databases supported. | In some opinions, less well maintained. Unclear roadmap. |

## Prisma

The monorepo implements full Prisma support with the following goals in mind:

-   avoid duplicate code by using existing database configuration modules
-   encourage schema definitions to be maintained within their appropriate module libraries
-   use `nx`' s `run-commands` executor for an integrated workflow with `prisma` CLI output caching
-   allow flexbility to maintain more than one PrismaClient for separate databases or schemas

These goals are achieved by wrapping the `prisma` CLI, which adds a minor delay to performance (<1-2 seconds) but provides better overall integration with the monorepo.

### PrismaWrapper

Use `yarn prisma` with any command and options normally provided to the `prisma` CLI. (For the `generate` command, use`yarn prisma:pnp` to load necessary modules.)

:::warning Note
A prisma schema is [not defined in `package.json`](https://www.prisma.io/docs/concepts/components/prisma-schema#prisma-schema-file-location) by default. Remember to specify the `schema` option: `--schema=libs/prisma/postgres/src/schema.prisma`.

If a default prisma schema is set in `package.json`, but more than one prisma instance is in use, specify the `--schema` option to override the default schema.
:::

The `PrismaWrapper` in `/libs/prisma/wrapper` spawns the `prisma` process with the environment variables it needs (incuding Docker secrets) from `connections.ts` in `DbConfigModule`. PostgreSQL is implemented as the default wrapper, but a MongoDB wrapper is also provided and can be used instead by changing the `yarn prisma` script to source from the `libs/prisma/mongo` directory instead of `libs/prisma/postgres`. Other wrappers can be iplemented using a similar structure.

### PrismaPostgres

While the `prisma` CLI can be manually invoked, frequently used commands and commands with dependencies should be added to the `PrismaPostgres` project in `workspace.json` so they can be run via `yarn nx`. The targets below are provided by default: e.g., `yarn nx lint PrismaPostgres`.

| Target     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`    | Generates the `PrismaClient` for the specified schema, which is then exported by `PrismaPostgres` to be consumed by the `DatabaseProvider`. Depends on `lint`.                                                                                                                                                                                                                                                                                                                                                                       |
| `lint`     | Lints the merged schema file. Depends on `merge`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `merge`    | Uses [PrisMerge](https://github.com/prisma-utils/prisma-utils/tree/main/libs/prismerge) to merge `base.prisma` file in `libs/prisma/postgres/src/lib`and all `*.pg.prisma` files in the monorepo into a single `schema.prisma` file in the library's source root, which is consumed by the `prisma` CLI. The `*.pg.prisma` extention and other files to merge, [including fragments](https://github.com/prisma-utils/prisma-utils/tree/main/libs/prismerge#fragments), can be modified in `libs/prisma/postgres/src/prismerge.json`. |
| `migrate`  | Uses the `prisma` CLI to apply migrations to the database. Depends on `build`.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `pull`     | Introspects the database and creates an `introspection.prisma` file in `libs/prisma/postgres/src` for reference.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `serve`    | Serves [`prisma studio`](https://www.prisma.io/studio) to browse data.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `validate` | Validate the merged prisma schema file. Depends on `lint`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

This setup allows schema definitions to reside in their appropriate library (e.g., `user.pg.prisma` is located within the `UserModule` library in `libs/nest/models/user`). The generated `PrismaClient` is extended and imported as the `PrismaService` in the `DatabaseProvider`. Other prisma schemas and clients can be added as additional services by following this same structure.

### PrismaMongo

The MongoDB implementation mirrors the PrismaPostgres structure, excluding migrations. (Prisma [does not support MongoDB migrations](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate) but [provides a related guide](https://www.prisma.io/docs/guides/database/using-prisma-with-mongodb#how-to-use-prisma-with-mongodb).) To use the MongoDB implementation as the `PrismaService` for `DatabaseProvider`, import `PrismaMongoService` in place of `PrismaPostgresService` in `libs/nest/providers/db/src/lib/prisma/default.service.ts`. Then uncomment the content of `libs/providers/db/src/lib/prisma/mongo.service.ts` and `libs/prisma/mongo/src/index.ts`, and delete or comment out the content of the corresponding Postgres files to avoid compile errors.

## TypeORM

The backend [follows Nest's entity repository pattern](https://docs.nestjs.com/techniques/database#typeorm-integration) for TypeORM using the `@nestjs/typeorm` package. The `DatabaseProvider`in `libs/nest/providers/db` establishes the default TypeORM database connection, with configurations provided for both PostgreSQL and MongoDB (see [Database](#database) section above).

Each entity (model) is encapsulated in its own library under `libs/nest/models` and listed along with its available migrations in the `ModelIndex` to be provided to TypeORM and other backend modules. More information about models is avaiable below in the [Entity Models](#entity-models) section.

## GraphQL

The backend [follows Nest's code-first approach]() for GraphQL, which auto-generates the schema at `apps/backend/schema.gql` based on decorators used in entity classes. The GraphQLProvider in `libs/nest/providers/graphql` configures the GraphQL instance. The default GraphQL URL is `/api/graphql`.

::: tip
Prisma [generators](https://www.prisma.io/docs/concepts/components/prisma-schema/generators#community-generators) create other outputs based on a schema file. A generator could be used in place of maintaining a separate entity model.
:::

The [Mercurius](https://mercurius.dev/) adapter for Fastify is used as the GraphQL server. It has built-in support for useful features like loaders and just-in-time compiliation, as well as easy to use plugins for authorization and caching. Benchmarks also show that [Mercurius is more performant than Apollo Server](../../reference/benchmarks.md#mercurius-graphql) and other Express- or Fastify-based setups. [Altair](https://altair.sirmuel.design) is used as a web-based GraphQL client and is accessible at `/api/altair`.
