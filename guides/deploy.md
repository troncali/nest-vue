# Deploy

This guide assumes a host machine already exists. If not, [create a host first](#create-a-production-host).

### Setup

Follow these steps on each machine from which you want to make deployments (like your local machine and the machine running jenkins, if different).

1. Create an SSH alias for your remote host. This is used for easier configuration of yarn scripts.
    - Create or edit the `config` file in your `~/.ssh` directory: `nano ~/.ssh/config`
    - Add the following block (subsitute your values):
    ```bash
    Host remoteHostAlias # the alias for this connection
      HostName example.com # the remote host's domain/IP
      Port 22 # the remote host's SSH port
      User username # the SSH login username
      IdentityFile ~/.ssh/private-key # the key to use for this connection
      IdentitiesOnly yes # attempt login with only the specified key
    ```
2. Create a docker context that points to your remote host over SSH. This is used for easier configuration of yarn scripts that use `docker compose`.
    - With [docker installed](setup.md), run the following command (substitute your values):
    ```bash
    docker context create contextName --description "Remote Host" --docker "host=ssh://remoteHostAlias:22"
    ```
3. Update the project `.env` file:
    - `DOCKER_REMOTE_CONTEXT=contextName`
    - `SSH_HOST_ALIAS=remoteHostAlias`

### Initial Deployment

`yarn deploy:init` builds and starts production docker containers on your host

-   `backend` will begin as the `blue` deployment (production) and a placeholder will begin in the `green` deployment (staging)
-   `frontend` files are uploaded to a mapped volume instead of being added directly into the `nginx` image, because updated image builds would disrupt the current state of the blue-green deployment status

### Manual Deployments

This project implements a blue-green deployment strategy for zero downtime between deployments. The Jenkins pipeline is configured to handle building, testing, migrating, and deploying to staging then production.

If you prefer to manually deploy or would like to implement another CI/CD tool, the following yarn scripts assist with maintaining zero downtime.

-   `yarn deploy:migrate`: run migrations and seed data
-   `yarn deploy:staging`: deploy to current staging environment
-   `yarn deploy:swap`: swap production and staging deployments

You can also directly deploy to production, but users will experience downtime while the containers and files are re-created.

-   `yarn deploy:production`: deploy to current production environment

# Create a Host

These steps contemplate a DigitalOcean droplet, but you can subsitute any machine running Ubuntu 20.04 LTS.

1. [Create the droplet](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ubuntu-20-04-server-on-a-digitalocean-droplet) (or [install Ubuntu on a machine](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview)) and configure.
    - Required steps:
        - Create an SSH key specific to this host
            - `ssh-keygen -t ed25519 -C "Comment" -f private-key`
            - Saves a new private key to `~/.ssh/private-key` and public key to `~/.ssh/private-key.pub`
        - Add your SSH public key to the host
            - [When you create the droplet](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ubuntu-20-04-server-on-a-digitalocean-droplet#step-8-—-setting-up-ssh-authentication)
            - [Or by copying it to the host](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04#step-2-—-copying-the-public-key-to-your-ubuntu-server)
        - [Install docker](https://docs.docker.com/engine/install/ubuntu/)
    - Recommended steps:
        - [Configure the SSH server to be more secure](https://linuxconfig.org/most-common-custom-ssh-configurations-of-the-openssh-server)
        - [Set up a UFW firewall](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-20-04)
        - [Install crowdsec](https://docs.crowdsec.net/docs/getting_started/install_crowdsec)
            ```bash
            curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash
            apt install crowdsec
            apt install crowdsec-firewall-bouncer-iptables
            # Then install collections of parsers
            cscli collections install crowdsecurity/base-http-scenarios
            cscli collections install crowdsecurity/nginx #etc
            ```
2. If you plan to deploy multiple projects on one host, set up a proxy to listen on ports 80 and 443 of the host
    - One solution is the [`nginx-proxy`](https://github.com/nginx-proxy/nginx-proxy) docker image. Deploy it first and dynamically update routing based on environment variables of the other docker containers you deploy.
    - In this scenario, edit `apps/docker/docker-compose-prod.yml` to comment out the port configuration on lines 16-18 and uncomment the proxy configuration on lines 20-28 and 48-51
        - By default, the `nginx` container will attempt to bind itself to ports 80 and 443 of the host machine, which would create a conflict if another instance is deployed because the ports can only be bound once
        - A proxy allows multiple deployments because the `nginx` containers will each be privately exposed to the proxy instead of attempting to bind to the host's public ports
        - Make sure your proxy and project share a mutual network so they can communicate (like lines 48-51)
3. Remember to bind any relevant docker logs to a host folder where crowdsec expects to find it
    - You can link `nginx` logs by adding this to the `volumes` block of `docker-compose-prod.yml`: `- /var/log/nginx:/var/log/nginx`
    - If you use `nginx-proxy`, you can just bind the proxy's nginx logs by adding the same (since everything will route through the proxy)
4. [Deploy](#deploy).
