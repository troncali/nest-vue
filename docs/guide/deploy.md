# Deploy

This guide assumes a host machine already exists. If not, [create a host first](../reference/create-host.md).

## Configure

Follow these steps on each machine from which deployments will be made (like your local machine and the machine running jenkins, if different).

1. Create an SSH alias for the remote host. This is used for easier configuration of yarn scripts.
    - Create or edit the `config` file in the `~/.ssh` directory: `nano ~/.ssh/config`
    - Add the following block (subsitute appropriate values):
    ```bash
    Host remoteHostAlias # the alias for this connection
      HostName example.com # the remote host's domain/IP
      Port 22 # the remote host's SSH port
      User username # the SSH login username
      IdentityFile ~/.ssh/private-key # the key to use for this connection
      IdentitiesOnly yes # attempt login with only the specified key
    ```
2. Create a docker context that points to the remote host over SSH. This is used for easier configuration of yarn scripts that use `docker compose`.
    - With [docker installed](./README.md#requirements), run the following command (substitute appropriate values):
    ```bash:no-line-numbers
    docker context create contextName --description "Remote Host" \
    	--docker "host=ssh://remoteHostAlias:22"
    ```
3. Update the project `.env` file:
    - `DOCKER_REMOTE_CONTEXT=contextName`
    - `SSH_HOST_ALIAS=remoteHostAlias`

## Initial Deployment

`yarn deploy:init` builds and starts production docker containers on the host.

-   `backend` will begin as the `blue` deployment (production) and a placeholder will begin in the `green` deployment (staging).
-   `frontend` files are uploaded to a mapped volume instead of being added directly into the `nginx` image because updated image builds would disrupt the current state of the blue-green deployment status.

::: danger NOTE
For initial SSL certficates to generate correctly, the first deployment cannot occur behind a proxy that forces HTTPS. `certbot` [performs an HTTP challenge on port 80](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) that will not succeed. However, subsequent renewals will not have this issue.
:::

## Manual Deployments

This project implements a blue-green deployment strategy for zero downtime between deployments. The Jenkins pipeline is configured to handle building, testing, migrating, and deploying to staging then production.

To manually deploy or implement another CI/CD tool, the following yarn scripts assist with maintaining zero downtime.

-   `yarn deploy:migrate` – run migrations and seed data
-   `yarn deploy:staging` – deploy to current staging environment
-   `yarn deploy:swap` – swap production and staging deployments

Direct deployment to production is possible, but users will experience downtime or errors while files are transferred and containers are re-created.

-   `yarn deploy:production` – deploy to current production environment
