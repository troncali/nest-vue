# Setup

## Requirements

-   Node 18: `brew install node` or [other method](https://nodejs.org/en/download/package-manager/)
-   Docker: `brew install --cask docker` or [other method](https://docs.docker.com/get-docker/)
-   Optional
    -   Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` or [other method](https://forge.rust-lang.org/infra/other-installation-methods.html)

::: warning Note
Yarn [has a bug](https://github.com/yarnpkg/berry/issues/1818#issuecomment-1065829365) that can cause some Nx commands to fail every other run (like `yarn nx build backend`). This monorepo has a [patched release of Yarn 4.0.0-rc.13](https://github.com/troncali/yarn-3.2.1-pnp-patch/tree/4.0.0-rc.13-patch).
:::

## Get Started

Clone this repository with [degit](https://github.com/Rich-Harris/degit) to scaffold a fresh monorepo without git history, or [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) it.

<CodeGroup>
<CodeGroupItem title="degit">

```bash
npm install -global degit
degit troncali/nest-vue project-name
cd project-name
yarn install
```

</CodeGroupItem>
<CodeGroupItem title="fork">

```bash
git clone --depth 1 https://github.com/YOUR-USERNAME/nest-vue project-name
cd project-name
yarn install
```

</CodeGroupItem>
</CodeGroup>

You could also configure your new project to [pull future updates from this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo#configuring-git-to-sync-your-fork-with-the-original-repository), but be careful when merging changes.

## VSCode Setup

Yarn has a [guide for working with PnP packages in Visual Studio Code](https://yarnpkg.com/getting-started/editor-sdks).

TLDR: `yarn dlx @yarnpkg/sdks vscode`.

:::tip
Declutter files that are rarely changed by installing the recommended `Peek Hidden Files` extension. Open the command palette (⌘⇧P) and select "Toggle Excluded Files" to show/hide the files listed in `.vscode/settings.json`
:::

## Project Setup

Some minimal setup is required to run apps and containers in your local environment.

### Environment Variables

1. Copy `.env-template` to `.env` and modify variable values as needed.
    - `cp .env-template .env`
2. Create Docker secret files for `DB_USERNAME`, `DB_PASSWORD`, `BACKEND_SESSION_KEY_1`, and `NGINX_STAGING_AUTH`.

<CodeGroup>
<CodeGroupItem title="DB_USERNAME">

```bash
echo "username" > ./apps/docker/secrets/DB_USERNAME
```

</CodeGroupItem>
<CodeGroupItem title="DB_PASSWORD">

```bash
echo "password" > ./apps/docker/secrets/DB_PASSWORD
```

</CodeGroupItem>
<CodeGroupItem title="BACKEND_SESSION_KEY_1">

```bash
yarn dlx --quiet @fastify/secure-session > ./apps/docker/secrets/BACKEND_SESSION_KEY_1
```

</CodeGroupItem>
<CodeGroupItem title="NGINX_STAGING_AUTH">

```bash
htpasswd -c ./apps/docker/secrets/NGINX_STAGING_AUTH username
```

</CodeGroupItem>
</CodeGroup>

### Certificates

1. Run `yarn docker:dev-certs` for self-signed SSL certificates for local development.
    - For the domain to be something other than `localhost`, edit `./apps/docker/src/nginx/dev-certs/dev-domains.ext` and change `DNS.1`, etc.
2. Add the certificate `./apps/docker/src/nginx/dev-certs/fullchain.pem` to trusted certificates.
    - See [this article's section on "Trusting Certificates on System"](https://tarunlalwani.com/post/self-signed-certificates-trusting-them/) for OS-specific steps

### Build Files

Run `yarn build backend` and `yarn build frontend` for initial builds.

## Run Local

After project setup, run `yarn docker:dev`, `yarn start backend`, and `yarn start frontend` in separate terminal tabs.

-   `nx` will automatically rebuild `backend` and `frontend` on saved file changes
-   The backend will be available at `https://localhost:3001/api/` (proxied through `nginx` with changes reflected on refresh)
-   The frontend will be separately available at `http://localhost:3001/` (live changes on save)

When the local setup is working, [set up deployments to a remote host](./deploy.md).
