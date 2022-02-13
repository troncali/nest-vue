# Setup

## Requirements

-   Node: `brew install node` or [other method](https://nodejs.org/en/download/package-manager/)
-   Docker: `brew install --cask docker` or [other method](https://docs.docker.com/get-docker/)

## Get Started

[Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) this repository, then clone a local copy to build out the project.

```bash:no-line-numbers
git clone --depth 1 https://github.com/YOUR-USERNAME/nest-vue project-name
cd project-name
yarn install
```

To benefit from future updates, [configure the fork to sync with this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo#configuring-git-to-sync-your-fork-with-the-original-repository).

## VSCode Setup

Yarn has a [guide for working with PnP packages in Visual Studio Code](https://yarnpkg.com/getting-started/editor-sdks).

TLDR: `yarn dlx @yarnpkg/sdks vscode`.

## Project Setup

Some minimal setup is required to run apps and containers in your local environment.

### Environment Variables

1. Copy `.env-template` to `.env` and modify variable values as needed.
    - `cp .env-template .env`
2. Create Docker secret files for `DB_USERNAME`, `DB_PASSWORD`, `BACKEND_SESSION_KEY_1`, and `NGINX_STAGING_AUTH`.
    - `echo "username" > ./apps/docker/secrets/DB_USERNAME`
    - `echo "password" > ./apps/docker/secrets/DB_PASSWORD`
    - `yarn run secure-session-gen-key > ./apps/docker/secrets/BACKEND_SESSION_KEY_1`
    - `htpasswd -c ./apps/docker/secrets/NGINX_STAGING_AUTH username`

### Certificate

1. Run `yarn docker:dev-cert` for a self-signed SSL certificate for local development.
    - For the domain to be something other than `localhost`, edit `./apps/docker/src/nginx/dev-certs/dev-domains.ext` and change `DNS.1`, etc.
2. Add the certificate `./apps/docker/src/nginx/dev-certs/fullchain.pem` to trusted certificates.
    - See [this article's section on "Trusting Certificates on System"](https://tarunlalwani.com/post/self-signed-certificates-trusting-them/) for OS-specific steps

### Build Files

Run `yarn build backend` and `yarn build frontend` for initial builds.

## Run Local

After project setup, run `yarn docker:dev`, `yarn start backend`, and `yarn start frontend` in separate terminal tabs.

-   `nx` will automatically rebuild `backend` and `frontend` on saved file changes
-   The backend will be available at [https://localhost:3001/api/](https://localhost:3001/api/) (proxied through `nginx` with changes reflected on refresh)
-   The frontend will be separately available at [http://localhost:3001/](http://localhost:3001/) (live changes on save)

When the local setup is working, [set up deployments to a remote host](./deploy.md).
