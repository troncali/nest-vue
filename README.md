# nest-vue

Typescript project template for [NestJS](https://docs.nestjs.com) + [Fastify](https://docs.nestjs.com/techniques/performance) backend, [Vue](https://v3.vuejs.org) frontend, and [Jest](https://jestjs.io) testing, managed by [Yarn](https://yarnpkg.com/getting-started/qa) with [PnP enabled](https://yarnpkg.com/features/pnp).

#### Get Started

```bash
git clone https://github.com/troncali/nest-vue project
cd project
yarn install
```

#### VSCode Setup

Yarn has a [guide for working with PnP packages in Visual Studio Code](https://yarnpkg.com/getting-started/migration#editor-support).

## Scripts

Scripts run from the root directory and must be called with `yarn` for proper module resolution.

-   `yarn b-build`: outputs compiled backend (Nest) to `./build`
-   `yarn f-build`: outputs compiled frontend (Vue) to `./public`
-   `yarn b-start`: serve and watch the backend at http://localhost:3000/
-   `yarn f-start`: serve and watch the frontend through the Vue CLI Service at http://localhost:8080/
-   `yarn test`: run all tests for backend and frontend
-   `yarn b-test`: run backend unit and e2e tests
-   `yarn f-test`: run frontend unit and e2e tests
