# Create a Host

These steps contemplate a DigitalOcean droplet, but subsitute any machine running Ubuntu 20.04 LTS. Other operating systems should work but may require different or additional steps not included in this guide.

## Required Steps

1. Create an SSH key for this host. The following saves a private key to `~/.ssh/new-key` and public key to `~/.ssh/new-key.pub`:

```bash:no-line-numbers
ssh-keygen -t ed25519 -C "Comment" -f new-key
```

2. [Create the droplet](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ubuntu-20-04-server-on-a-digitalocean-droplet) (or [install Ubuntu on a machine](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview)).
3. Add the SSH public key to the host [when creating the droplet](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-ubuntu-20-04-server-on-a-digitalocean-droplet#step-8-setting-up-ssh-authentication) (or [by copying it to the host](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04#step-2-—-copying-the-public-key-to-your-ubuntu-server)).
4. [Install docker](https://docs.docker.com/engine/install/ubuntu/).

## Recommended Steps

-   [Configure the SSH server to be more secure](https://linuxconfig.org/most-common-custom-ssh-configurations-of-the-openssh-server).
-   [Set up a UFW firewall](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-20-04).
-   [Install crowdsec](https://docs.crowdsec.net/docs/getting_started/install_crowdsec):

```bash:no-line-numbers
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash
apt install crowdsec
apt install crowdsec-firewall-bouncer-iptables
# Then install collections of parsers
cscli collections install crowdsecurity/base-http-scenarios
cscli collections install crowdsecurity/nginx # etc
```

Remember to also bind any relevant docker logs to a host folder where `crowdsec` expects to find it. For example, bind `nginx` logs by adding this to the `volumes` block of its configuration in `apps/docker/docker-compose-prod.yml`: `- /var/log/nginx:/var/log/nginx`

## Optional: Multi-Project Proxy

To deploy multiple instances of this monorepo on one host—or other HTTP/HTTPS projects that must be publicly exposed on standard ports—[set up a proxy](../reference/proxy.md) to route traffic from ports 80 and 443 of the host to the appropriate Docker container.  Additionally, since all traffic will route through the proxy, for crowdsec protection you can bind the proxy's nginx logs in the same manner described in the [recommended steps](#recommended-steps).

## Deploy

When the host is securely running, [configure deployments](../guide/deploy.md).
