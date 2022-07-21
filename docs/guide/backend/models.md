# Backend Models

## Module Structure

A model library generally has the following structure in its `src` folder:

| File                                      | Purpose                                                                   |
| :---------------------------------------- | :------------------------------------------------------------------------ |
| `lib/entity.module.ts`                    | Encapsulates the entity with its controller, providers, and services.     |
| `lib/entity.entity.ts`                    | Defines the structure of the entity using TypeORM and GraphQL decorators. |
| `lib/entity.dto.ts`                       | Defines data transfer objects and other types related to the entity.      |
| `lib/entity.controller.ts`                | Establishes CRUD routes for the entity.                                   |
| `lib/entity.pg.prisma`                    | Defines the prisma schema for the entity.                                 |
| `lib/migrations/*.migration.ts`           | Define migrations for the entity.                                         |
| `lib/migrations/entity.seeder.ts`         | Encapsultes the entity seeder.                                            |
| `lib/migrations/entity.seeder.service.ts` | Provides the data to seed.                                                |
| `lib/providers/entity.resolver.ts`        | Provides GraphQL resolvers and mutations.                                 |
| `lib/providers/entity.service.ts`         | Provides functions to query and manipulate the entity.                    |

Model-specific details, including related data-transfer objects, are [available in the project documentation for the backend](/reference/backend.md) (see Entities).

## Primary Keys

UUIDs are popular as primary keys, but they are [not necessarily the best for storage size and performance](https://www.percona.com/blog/2019/11/22/uuids-are-popular-but-bad-for-performance-lets-discuss/).
