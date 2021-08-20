# Initial Setup

### Requirements:

-   Docker: `brew install --cask docker`

### Steps

1. Make sure your terminal is in the root directory of your project.
2. Copy `.env-template` to `.env`.
    - `cp .env-template .env`
    - Modify the variables in `.env` to your requirements.
3. Generate Docker Secrets files for `DB_USERNAME`, `DB_PASSWORD`, and `BACKEND_SESSION_KEY_1`.
    - `echo "username" > ./src/docker/secrets/DB_USERNAME`
    - `echo "password" > ./src/docker/secrets/DB_PASSWORD`
    - `yarn run secure-session-gen-key > ./src/docker/secrets/BACKEND_SESSION_KEY_1`
4. Run `yarn nx build backend` and `yarn nx build frontend` to generate initial builds.
5. Generate a self-signed SSL certificate for local development.
    - If you would like to edit the local domain to be something other than `localhost`, edit `./src/docker/nginx/dev-certs/dev-domains.ext` and change `DNS.1`, etc.
    - `yarn docker:dev-cert`
    - Add the certificate (saved to `./src/docker/nginx/dev-certs/fullchain.pem`) to your trusted certificates.
6. Run `yarn docker:dev`, `yarn nx serve backend`, and `yarn nx serve frontend`
    - `nx` will automatically update `frontend` and `backend` on saved file changes
    - The backend will be available at https://localhost:3001/v1/, proxied through `nginx` with changes reflected on refresh
    - The frontend will be separately available at http://localhost:3001/, with live changes on save
