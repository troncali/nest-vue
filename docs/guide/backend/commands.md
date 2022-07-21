# Backend Commands

## Yarn

See the [reference page for yarn scripts](/reference/scripts.md).

## Nx

Below are commands configured in `workspace.json` that can be invoked as follows:

```bash
yarn nx [command] backend [--prod]
```

| Command | Description                                                                                                                                                                                                                                                                                                                                               |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build` | Builds the backend, TypeORM migrator, and database seeder with webpack and outputs files to `dist/apps/backend/` as `main.js`, `migrate.js`, and `seed.js`. Depends on `PrismaPostgres`: will merge and lint Prisma schema, then generate the PrismaClient before building `backend`. Pass `--prod` option after `backend` for optimized production build. |
| `e2e`   | Runs end-to-end tests with Jest.                                                                                                                                                                                                                                                                                                                          |
| `prod`   | Runs `build` in a production configuration and copies `schema.prisma` into the deployable directory at `dist/apps/backend`.                                                                                                                                                                                                                                                                                                                          |
| `lint`  | Lints `*.ts` files in the `apps/backend/` directory with ESLint.                                                                                                                                                                                                                                                                                          |
| `serve` | Serves the backend at http://localhost:3001/api/ and watches for file changes.                                                                                                                                                                                                                                                                            |
| `test`  | Runs integration tests with Jest.                                                                                                                                                                                                                                                                                                                         |

## Generators

There are three other types of CLIs:
- The @nrwl/nest library provides [Nest generators](https://nx.dev/packages/nest
).    
- The full Prisma CLI is exposed through `yarn prisma`.  There are also [pre-configured Nx commands for Prisma](data.md#prismapostgres).
- Create TypeORM migrations with `yarn typeorm:migration-create`
