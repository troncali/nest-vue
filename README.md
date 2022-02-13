# nest-vue

[Nx](https://nx.dev) monorepo with [NestJS](https://docs.nestjs.com) + [Fastify](https://docs.nestjs.com/techniques/performance) backend, [Vue](https://v3.vuejs.org) frontend, [Jest](https://jestjs.io) and [Cypress](https://cypress.io) testing, and agnostic data via [TypeORM](https://typeorm.io/#/) + [GraphQL](https://graphql.org).

Managed by [Yarn](https://yarnpkg.com/getting-started/qa) with [PnP enabled](https://yarnpkg.com/features/pnp), and powered by [Docker](https://www.docker.com) with [NGINX](https://www.nginx.com) + [Node.js](https://nodejs.dev) under the hood, [certbot](https://certbot.eff.org) SSL, and [Jenkins](https://www.jenkins.io) CI/CD.

#### Get Started

[Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) this repository, then clone a local copy to build out the project.

```bash
git clone --depth 1 https://github.com/YOUR-USERNAME/nest-vue project-name
cd project-name
yarn install
```

To benefit from future updates, [configure the fork to sync with this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo#configuring-git-to-sync-your-fork-with-the-original-repository).

#### VSCode Setup

Yarn has a [guide for working with PnP packages in Visual Studio Code](https://yarnpkg.com/getting-started/editor-sdks).

TLDR: `yarn dlx @yarnpkg/sdks vscode`.

#### Project Setup

Some minimal setup is required (environment variables, certificates, etc) to run apps and containers in your local environment. [Follow the guide](docs/guide/setup.md).

## The Stack

Here's what this [monorepo](https://nx.dev/guides/why-monorepos) helps to more easily deploy, so the focus can stay on substance:

### Apps (VxNN)

-   [**Vue 3 Frontend**](https://vuejs.org) – JavaScript framework with a declarative and component-based programming model that helps efficiently develop user interfaces.
-   **x (Data)** – agnostic data access through [TypeORM](https://typeorm.io/#/) and [GraphQL](https://graphql.org). [PostgreSQL](https://www.postgresql.org) and [MongoDB](https://www.mongodb.com) setups included, but configure and use [any supported database](https://typeorm.io/#/connection-options).
-   [**Nest 8 Backend**](https://nestjs.com) – progressive [Node.js](https://nodejs.org/en/) framework for building efficient, reliable, and scalable server-side applications.
-   [**NGINX**](https://www.nginx.com/resources/wiki/) – high-performance HTTP server and reverse proxy with simple configuration and low resource consumption.

### Tools

-   [**Nx 13**](https://nx.dev) – extensible build framework with computation caching to rebuild only what is necessary; includes Nest and Vue plugins that expose their CLI generators, etc.
-   [**Yarn 3**](https://yarnpkg.com) – slim dependency management using [Plug'N'Play](https://yarnpkg.com/features/pnp) for smaller repositories.
-   [**Docker**](https://www.docker.com/get-started) – spin up the database, backend, and frontend with consistent environments both locally and on remote hosts.
-   [**Certbot**](https://certbot.eff.org) – SSL certificate generation for both local development and remote hosts.
-   [**Jenkins**](https://www.jenkins.io) – base CI/CD pipeline that can be built out to meet requirements.

## Documentation

Learn how to get started with this respository, how to deploy it, how services are set up, and how to customize services at [vxnn.troncali.com/guide/](https://vxnn.troncali.com/guide/).

-   [Initial Setup](docs/guide/setup.md)
-   [Deploy](docs/guide/deploy.md)
-   [Guide](https://vxnn.troncali.com/guide/)
-   [Backend Documentation](https://vxnn.troncali.com/reference/backend.html)
-   [Backend API on Postman](https://www.postman.com/troncali/workspace/nest-vue)

## Scripts

Scripts run from the monorepo root and must be called with `yarn` to resolve dependencies. [Cross-var](https://www.npmjs.com/package/cross-var) and [cross-env](https://www.npmjs.com/package/cross-env) are used for Windows compatibility.

#### Development

-   `yarn docker:dev` – spins up `db` and `nginx` for local development
    -   Nginx proxies to the local backend to mimic production and take advantage of developer tools (like file watching)
-   `yarn start [app]` – serve and watch an app (`backend` or `frontend`)
    -   `backend` served at [http://localhost:3001/api/](http://localhost:3001/api/); also HTTPS if `nginx` container is running
    -   `frontend` served at [http://localhost:8080/](http://localhost:8080/)
-   `yarn nx [command]` – run any normal `nx` command
-   `yarn build [app]` – output compiled app to `./dist/apps/[project]`
-   `yarn build:prod` – output compiled app optimized for production
-   `yarn migration:[create|run|undo]` – create, run, or undo a database migration in production
-   `yarn seed` – seed the database

#### Testing

-   `yarn test [app]` – run unit tests
-   `yarn e2e [app]` – run integration tests (Cypress for frontend, Jest for backend)
-   `yarn snyk` – check dependency vulnerabilities

#### Deployment (Blue/Green)

-   `yarn deploy:init` – [configure](guides/deploy.md#configure) for an easy first deployment
-   `yarn deploy:migrate` – run migrations and seed data
-   `yarn deploy:staging` – deploy to current staging environment
-   `yarn deploy:swap` – swap production and staging deployments (no downtime)
-   `yarn deploy:production` – deploy to current production environment (with downtime)

#### Support

-   `yarn docker:dev-certs` – create SSL certificates for local development
-   `yarn docker:build` – build production docker images
-   `yarn docs:b` – output `backend` docs to `./dist/docs/backend`; serve at [localhost:9997](http://localhost:9997/)
-   `yarn docs:m` – output compiled monorepo docs to `./dist/docs/vuepress`
-   `yarn docs:m-dev` – watch and serve monorepo docs at [localhost:9998](http://localhost:9998/)
-   `yarn jenkins` – serve Jenkins at [localhost:9999](http://localhost:9999/)
    -   Must install Jenkins: `brew install jenkins`
