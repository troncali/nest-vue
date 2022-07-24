# Backend Structure

The backend is an implementation of NestJS. NestJS's documentation is available at [https://docs.nestjs.com](https://docs.nestjs.com). Monorepo documentation specific to this backend is [available here](/reference/backend.md).

## App

The backend application has the following structure in `apps/backend/src`:

| File                    | Purpose                                                                                    |
| :---------------------- | :----------------------------------------------------------------------------------------- |
| `main.ts`               | Bootstraps the main application and settings.                                              |
| `migrate.ts`            | Bootstraps the application to run TypeORM migrations.                                      |
| `seed.ts`               | Bootstraps the application to seed data.                                                   |
| `app/app.module.ts`     | Encapsulates all application dependencies, including controllers, providers, and services. |
| `app/app.controller.ts` | Establishes global application routes that are not handled by other controllers.           |
| `app/app.service.ts`    | Provides global application functions to be used by other modules.                         |

## Libs

The `AppModule` primarily imports library modules from `libs/nest` and `libs/prisma`. These libraries establish the controllers, models, providers, and services that implement the core functionality of the backend application. [Documentation for these modules is available here](/reference/backend.md), and the following pages provide high-level overviews of key parts.
