# SSL & Other Ratings

## SSL Labs: A+

This monorepo's default NGINX configuration results in an "A" rating out of the box. An "A+" rating is easy: set the HSTS header on line 10 of `/apps/docker/src/nginx/confs/headers.conf` to 6 months or longer, but only when ready and the implications are understood ([see section on Testing HTTP Strict Transport Security with Care](https://www.nginx.com/blog/http-strict-transport-security-hsts-and-nginx/)).

![](/images/sslreport.png)
_This site is now deployed [behind a proxy](./proxy.md) with slightly different SSL settings, but the result above was captured as a direct deployment without the proxy._
