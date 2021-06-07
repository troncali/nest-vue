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

-   **Nx** - extensible build framework with computation caching to rebuild only what is necessary; includes Nest and Vue plugins that expose their CLI generators, etc.
-   **Yarn** - slim dependency management using [Plug'N'Play](https://yarnpkg.com/features/pnp) for smaller repositories.
    -   This repository is roughly 216 mb with 288 items.
    -   Using `npm install`, the repository is roughly 770 mb with 75,856 items (March 6, 2021).
-   **Docker** - spin up your database, backend, and frontend with consistent environments both locally and on remote hosts.
-   **certbot** - SSL certificate generation for both local development and remote hosts.
-   **Jenkins** - base pipeline for CI/CD that can be built out to fit your needs.

## Documentation

Learn how to get started with this respository, how services are set up, and how you can customize them to your needs.

-   [Initial Setup](guides/setup.md)
-   [Docker](README-Docker.md) - in progress
-   [Jenkins](README-Jenkins.md) - in grogress
-   [Resources](README-Resources.md) - in progress
-   [Roadmap](README-Roadmap.md) - in progress

## Scripts

Scripts run from the project root and must be called with `yarn` to resolve dependencies.

#### Development

-   `yarn docker:dev`: spins up `db` and `nginx` for local development
    -   Nginx proxies to the local backend to mimic production and take advantage of developer tools (like file watching)
-   `yarn nx serve [app]`: serve and watch an app (`backend` or `frontend`)
    -   `backend` served at http://localhost:3001/; also https if nginx container is running
    -   `frontend` served at http://localhost:8080/
-   `yarn nx build [app]`: outputs compiled app to `./builds/[project]`
-   `yarn migration:[create|run|undo]`: create, run, or undo a database migration
-   `yarn seed`: seed the database

#### Testing

-   `yarn nx test [app]`: run unit tests
-   `yarn nx e2e [app]`: run integration tests (Cypress for frontend, Jest for backend)
-   `snyk test`: check dependency vulnerabilities

#### Support

-   `yarn docker:dev-certs`: create SSL certificates for local development
-   `yarn docker:deploy`: add your docker context for easy deployment
-   `yarn docs`: outputs backend (Nest) documentation to `./docs`
-   `yarn jenkins`: spin up Jenkins (must install Jenkins, `brew install jenkins`)
