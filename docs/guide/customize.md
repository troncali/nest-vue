# Customize

There are a number of ways to extend the monorepo or replace parts of it. [36 official Nx plugins](https://nx.dev/community#create-nx-plugin) support frameworks and libraries like React, Express, and Angular—plus contributions from the community for Vite, Rust, Solid, and others.

These plugins provide generators, executors, and other tools to help scaffold new applications that add to or replace pieces of the monorepo. It is also possible to implement any CLI-based framework or library that does not have a specific plugin by using Nx's `run-commands` executor and specifying implicit file dependencies along with file outputs to cache. (See the `frontend` and Prisma projects in `workspace.json` for example configurations.)

Ultimatley, there are many directions the monorepo can go.
