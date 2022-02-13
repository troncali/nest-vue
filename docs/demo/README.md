# Demo

This site is a working implementation of the monorepo running on a basic DigitalOcean droplet with 1vCPU, 1GB memory, and 25GB SSD. ([Except traffic is first routed through `nginx-proxy`](../reference/proxy.md).)

-   The `frontend` (Vue/Vuepress) is served through `nginx`, which also proxies to initial `backend` (Nest) paths, like [https://vxnn.troncali.com/api/](https://vxnn.troncali.com/api/).
    -   A future update for this page will include frontend components that interact with the backend.
    -   For now, [the backend API can be explored through Postman](https://www.postman.com/troncali/workspace/nest-vue).
-   Staging is served by `nginx` behind basic authentication at [https://staging-vxnn.troncali.com/](https://staging-vxnn.troncali.com/).
-   The current deployment ID for production (blue or green) is provided by `nginx` at [https://vxnn.troncali.com/id](https://vxnn.troncali.com/id).
