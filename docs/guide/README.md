# The Stack

Here's what this [monorepo](https://nx.dev/guides/why-monorepos) helps to more easily deploy, so the focus can stay on substance:

## Apps (VxNN)

-   [**Vue 3 Frontend**](https://vuejs.org) – JavaScript framework with a declarative and component-based programming model that helps efficiently develop user interfaces.
-   **x (Data)** – agnostic data access through [TypeORM](https://typeorm.io/#/) and [GraphQL](https://graphql.org). [PostgreSQL](https://www.postgresql.org) and [MongoDB](https://www.mongodb.com) setups included, but configure and use [any supported database](https://typeorm.io/#/connection-options).
-   [**Nest 8 Backend**](https://nestjs.com) – progressive [Node.js](https://nodejs.org/en/) framework for building efficient, reliable, and scalable server-side applications.
-   [**NGINX**](https://www.nginx.com/resources/wiki/) – high-performance HTTP server and reverse proxy with simple configuration and low resource consumption.

## Tools

-   [**Nx 13**](https://nx.dev) – extensible build framework with computation caching to rebuild only what is necessary; includes Nest and Vue plugins that expose their CLI generators, etc.
-   [**Yarn 3**](https://yarnpkg.com) – slim dependency management using [Plug'N'Play](https://yarnpkg.com/features/pnp) for smaller repositories.
-   [**Docker**](https://www.docker.com/get-started) – spin up the database, backend, and frontend with consistent environments both locally and on remote hosts.
-   [**Certbot**](https://certbot.eff.org) – SSL certificate generation for both local development and remote hosts.
-   [**Jenkins**](https://www.jenkins.io) – base CI/CD pipeline that can be built out to meet requirements.
