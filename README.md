# nest-vue

Fullstack typescript monorepo for [NestJS](https://docs.nestjs.com) + [Fastify](https://docs.nestjs.com/techniques/performance) backend, [Vue](https://v3.vuejs.org) frontend, [Jest](https://jestjs.io) testing, and agnostic data via [TypeORM](https://typeorm.io/#/) + [GraphQL](https://graphql.org).

Managed by [Yarn](https://yarnpkg.com/getting-started/qa) with [PnP enabled](https://yarnpkg.com/features/pnp), and powered by [Docker](https://www.docker.com) with [NGINX](https://www.nginx.com) + [Node.js](https://nodejs.dev) under the hood, [certbot](https://certbot.eff.org) SSL, and [Jenkins](https://www.jenkins.io) CI/CD.

#### Get Started

```bash
git clone https://github.com/troncali/nest-vue your-project
cd your-project
yarn install
```

#### VSCode Setup

Yarn has a [guide for working with PnP packages in Visual Studio Code](https://yarnpkg.com/getting-started/migration#editor-support). TLDR: `yarn dlx @yarnpkg/pnpify --sdk vscode`.

#### Project Setup

Some minimal setup is required (environment variables, certificates, etc). [Follow the guide](guides/setup.md).

## The Stack (VxNN)

Here's what this boilerplate template is meant to help you easily deploy, so you can jump straight to substance:

-   **Vue 3**
-   **x (Database)** - [PostgreSQL](https://www.postgresql.org) and [MongoDB](https://www.mongodb.com) setups included, but configure and use any database you want.
    -   **TypeORM**
    -   **GraphQL/Apollo**
-   **NestJS**
-   **NGINX**

These core services are supported by the following:

-   **Yarn** - slim dependency management using [Plug'N'Play](https://yarnpkg.com/features/pnp) for smaller repositories.
    -   This repository is roughly 216 mb with 288 items.
    -   Using `npm install`, the repository is roughly 770 mb with 75,856 items (March 6, 2021).
-   **Docker** - spin up your database, backend, and frontend with consistent environments both locally and on remote hosts.
-   **certbot** - SSL certificate generation for both local development and remote hosts.
-   **Jenkins** - base pipeline for CI/CD that can be built out to fit your needs.

## Scripts

Scripts run from the project root and must be called with `yarn` to resolve dependencies.

-   `yarn docker:dev`: spins up db and nginx for local development
    -   Nginx proxies to the local backend to mimic production and take advantage of developer tools (like file watching)
-   `yarn b-start`: serve and watch the backend at http://localhost:3001/
-   `yarn f-start`: serve and watch the frontend through the Vue CLI Service at http://localhost:8080/
-   `yarn b-build`: outputs compiled backend (Nest) to `./build`
-   `yarn f-build`: outputs compiled frontend (Vue) to `./public`
-   `yarn test`: run all tests for backend and frontend
-   `yarn b-test`: run backend unit and e2e tests
-   `yarn f-test`: run frontend unit and e2e tests
-   `yarn docs`: outputs backend (Nest) documentation to `./docs`
-   `yarn jenkins`: spin up Jenkins

## Documentation

In progress.

Learn how to get started with this respository, how services are set up, and how you can customize them to your needs.

-   [Initial Setup](guides/setup.md)
-   [Docker](README-Docker.md)
-   [Jenkins](README-Jenkins.md)
-   [Resources](README-Resources.md)
-   [Roadmap](README-Roadmap.md)
