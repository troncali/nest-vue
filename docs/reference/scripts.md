# Yarn Scripts

Scripts run from the monorepo root and must be called with `yarn` to resolve dependencies. [Cross-var](https://www.npmjs.com/package/cross-var) and [cross-env](https://www.npmjs.com/package/cross-env) are used for Windows compatibility.

## Development

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

## Testing

-   `yarn test [app]` – run unit tests
-   `yarn e2e [app]` – run integration tests (Cypress for frontend, Jest for backend)
-   `yarn snyk` – check dependency vulnerabilities

## Deployment (Blue/Green)

-   `yarn deploy:init` – [configure](../guide/deploy.md#configure) for an easy first deployment
-   `yarn deploy:migrate` – run migrations and seed data
-   `yarn deploy:staging` – deploy to current staging environment
-   `yarn deploy:swap` – swap production and staging deployments (no downtime)
-   `yarn deploy:production` – deploy to current production environment (with downtime)
-   `yarn deploy:placeholder` – replace current backend in staging with lightweight placeholder

## Support

-   `yarn docker:dev-certs` – create SSL certificates for local development
-   `yarn docker:build` – build production docker images
-   `yarn docs:b` – output `backend` docs to `./dist/docs/backend`; serve at [localhost:9997](http://localhost:9997/)
-   `yarn docs:m` – output compiled monorepo docs to `./dist/docs/vuepress`
-   `yarn docs:m-dev` – watch and serve monorepo docs at [localhost:9998](http://localhost:9998/)
-   `yarn jenkins` – serve Jenkins at [localhost:9999](http://localhost:9999/)
    -   Must install Jenkins: `brew install jenkins`
