# Multi-Project Proxy

To deploy multiple instances of this monorepo on one host—or another HTTP/HTTPS project that must also be publicly exposed on standard ports—set up a proxy to route traffic from ports 80 and 443 of the host to the appropriate Docker container.

## Solution

One solution is [`nginx-proxy`](https://github.com/nginx-proxy/nginx-proxy#separate-containers). Deploy it first and dynamically update routing based on environment variables of the other docker containers that are deployed. In this arrangement, edit `apps/docker/docker-compose-prod.yml` to comment out the port configuration for `nginx` on lines 16-18 (these will be the proxy's ports) and uncomment the proxy configuration on lines 20-28 and 48-51 (the proxy will forward traffic to `nginx`).

::: warning NOTE
Make sure the proxy and project share a mutual docker network, so they can communicate (like lines 48-51).

For SSL certficates to generate correctly, the first deployment cannot occur behind a proxy that forces HTTPS. `certbot` [performs an HTTP challenge on port 80](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) that will not succeed. A solution is described in lines 16-19 of the sample code below for `docker-compose-prod.yml`. Subsequent certificate renewals will not have this issue.
:::

## Sample Code

:::: code-group
::: code-group-item proxy.Dockerfile

```dockerfile
FROM nginx:alpine

# Add timezone for alpine
RUN apk add --no-cache tzdata

# Turn off server tokens and write logs both to file and stdout/stderr on alpine
RUN { \
      echo 'server_tokens off;'; \
      echo 'access_log /var/log/nginx/access.log;'; \
      echo 'error_log /var/log/nginx/error.log;'; \
      echo 'access_log /dev/stdout;'; \
      echo 'error_log /dev/stderr;'; \
    } > /etc/nginx/conf.d/my_proxy.conf
```

:::
::: code-group-item docker-compose.yml

```yaml
version: "3.8"

services:
    proxy:
        build:
            context: .
            dockerfile: proxy.Dockerfile
        container_name: proxy
        deploy:
            mode: global
        restart: always
        volumes:
            - /var/log/nginx:/var/log/nginx
			# Mount read-only conf.d and SSL certificates
            - proxy-conf.d:/etc/nginx/conf.d:ro
			- /host/path/to/certs:/etc/nginx/certs:ro
        ports:
            - "80:80"
            - "443:443"
        networks:
            - proxy-network
        environment:
            - TZ=America/Los_Angeles

    docgen:
        image: jwilder/docker-gen
        container_name: docgen
        deploy:
            mode: global
        restart: always
        command: -notify-sighup proxy -watch /etc/docker-gen/templates/nginx.tmpl /etc/nginx/conf.d/default.conf
        networks:
            - proxy-network
        volumes:
            - /var/run/docker.sock:/tmp/docker.sock:ro
            # Must ensure nginx.tmpl is on host
            - /var/lib/docker/nginx/nginx.tmpl:/etc/docker-gen/templates/nginx.tmpl
			# Mount writeable conf.d and read-only SSL certificates
			- proxy-conf.d:/etc/nginx/conf.d
			- /host/path/to/certs:/etc/nginx/certs:ro
        environment:
            - HTTPS_METHOD=noredirect

    project:
        build:
            context: .
            dockerfile: project.Dockerfile
        networks:
            - proxy-network
        expose:
            - "80"
			- "443"
        environment:
            - VIRTUAL_HOST=example.com,www.example.com
			- VIRTUAL_PROTO=https
            - VIRTUAL_PORT=443

volumes:
    proxy-conf.d:

networks:
    proxy-network:
        name: proxy-network
        driver: bridge
```

:::
::: code-group-item apps/docker/docker-compose-prod.yml

```yaml
version: "3.8"

services:
	# ...
    nginx:
        # ...
        # USE 1. ports if mapping the nginx service directly to host ports
        # ports:
        #     - "80:80"
        #     - "443:443"
        # OR 2. settings below if using a proxy in front of the nginx service
        networks:
            - proxy-network
        environment:
            - VIRTUAL_HOST=${APP_DOMAIN},www.${APP_DOMAIN},${STAGING_DOMAIN}
			# ** For an initial deployment, use 'http' and '80' for these
			# values to allow certbot to generate SSL certificates. Then
			# redeploy the nginx container with 'https' and '443' values
			# (nginx forces HTTPS for non-cerbot traffic by default). **
            - VIRTUAL_PROTO=https
            - VIRTUAL_PORT=443
        expose:
            - 80
            - 443
# ...
networks:
    proxy-network:
        name: proxy-network
        external: true
```

:::
::::
