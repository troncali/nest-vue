# nest-vue

[Nx](https://nx.dev) monorepo with [NestJS](https://docs.nestjs.com) + [Fastify](https://docs.nestjs.com/techniques/performance) backend, [Vue](https://v3.vuejs.org) frontend, [Jest](https://jestjs.io) and [Cypress](https://cypress.io) testing, and agnostic data via [TypeORM](https://typeorm.io/#/) + [GraphQL](https://graphql.org).

Managed by [Yarn](https://yarnpkg.com/getting-started/qa) with [PnP enabled](https://yarnpkg.com/features/pnp), and powered by [Docker](https://www.docker.com) with [NGINX](https://www.nginx.com) + [Node.js](https://nodejs.dev) under the hood, [certbot](https://certbot.eff.org) SSL, and [Jenkins](https://www.jenkins.io) CI/CD.

#### Get Started

[Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) this repository to your account, then clone a local copy to build out your project.

```bash
git clone --depth 1 https://github.com/YOUR-USERNAME/nest-vue your-project
cd your-project
yarn install
```

If you want to benefit from future updates, [configure your fork to sync with this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo#configuring-git-to-sync-your-fork-with-the-original-repository).

#### VSCode Setup

Yarn has a [guide for working with PnP packages in Visual Studio Code](https://yarnpkg.com/getting-started/editor-sdks). TLDR: `yarn dlx @yarnpkg/sdks vscode`.

#### Project Setup

Some minimal setup is required (environment variables, certificates, etc). [Follow the guide](guides/setup.md).

## The Stack (VxNN)

Here's what this monorepo is meant to help you easily deploy, so you can jump straight to substance:

-   **Vue v3**
-   **x (Database)** - [PostgreSQL](https://www.postgresql.org) and [MongoDB](https://www.mongodb.com) setups included, but configure and use any database you want.
    -   **TypeORM**
    -   **GraphQL/Apollo**
-   **NestJS v8**
-   **NGINX**

These core services are supported by the following:

-   **Nx v12** - extensible build framework with computation caching to rebuild only what is necessary; includes Nest and Vue plugins that expose their CLI generators, etc.
-   **Yarn v3** - slim dependency management using [Plug'N'Play](https://yarnpkg.com/features/pnp) for smaller repositories.
-   **Docker** - spin up your database, backend, and frontend with consistent environments both locally and on remote hosts.
-   **Certbot** - SSL certificate generation for both local development and remote hosts.
-   **Jenkins** - base pipeline for CI/CD that can be built out to fit your needs.

## Documentation

Learn how to get started with this respository, how services are set up, and how you can customize them to your needs.

-   [Initial Setup](guides/setup.md)
-   [Deploy](guides/deploy.md)
-   [Docker](guides/docker.md) - in progress
-   [Jenkins](guides/jenkins.md) - in grogress
-   [Resources](guides/resources.md) - in progress
-   [Roadmap](guides/roadmap.md) - in progress

## Scripts

Scripts run from the project root and must be called with `yarn` to resolve dependencies. [Cross-var](https://www.npmjs.com/package/cross-var) and [cross-env](https://www.npmjs.com/package/cross-env) are used for Windows compatibility.

#### Development

-   `yarn docker:dev`: spins up `db` and `nginx` for local development
    -   Nginx proxies to the local backend to mimic production and take advantage of developer tools (like file watching)
-   `yarn start [app]`: serve and watch an app (`backend` or `frontend`)
    -   `backend` served at http://localhost:3001/; also https if nginx container is running
    -   `frontend` served at http://localhost:8080/
-   `yarn nx [command]`: run any normal `nx` command
-   `yarn build [app]`: outputs compiled app to `./builds/[project]`
-   `yarn build:prod`: outputs compiled app optimized for production
-   `yarn migration:[create|run|undo]`: create, run, or undo a database migration
-   `yarn seed`: seed the database

#### Testing

-   `yarn test [app]`: run unit tests
-   `yarn e2e [app]`: run integration tests (Cypress for frontend, Jest for backend)
-   `yarn snyk`: check dependency vulnerabilities

#### Deployment (Blue/Green)

-   `yarn deploy:init`: [configure](guides/deploy.md#setup) for an easy first deployment
-   `yarn deploy:migrate`: run migrations and seed data
-   `yarn deploy:staging`: deploy to current staging environment
-   `yarn deploy:swap`: swap production and staging deployments (no downtime)
-   `yarn deploy:production`: deploy to current production environment (with downtime)

#### Support

-   `yarn docker:dev-certs`: create SSL certificates for local development
-   `yarn docker:build`: build production docker images
-   `yarn docs`: output `backend` (Nest) documentation to `./docs`
-   `yarn jenkins`: serve Jenkins (must install Jenkins, `brew install jenkins`)
