# Benchmarks

Benchmarks are fairly subjective and rarely match specific use cases, unless the benchmark is written to test a specific implementation. However, below are some benchmark results that support why this monorepo uses Nest and Vue as the default backend and frontend frameworks. Their general performance, implementation styles, and mature ecosystems make them solid, performant, and secure choices.

## Nest

Below is a summary of the ranking and performance of some backends in [TechEmpower's Round 20 Web Framework Benchmarks](https://www.techempower.com/benchmarks/#section=data-r20&hw=cl&test=composite&l=yykhdr-sd).

| Composite Rank | Framework | Language | JSON Res/s | Fortunes Res/s |
| :------------: | :-------: | :------: | :--------: | :------------: |
|       6        |   Actix   |   Rust   |  233,745   |     98,244     |
|       14       |   Fiber   |    Go    |  167,451   |     49,401     |
|       68       |  NodeJS   |    JS    |   45,826   |     14,631     |
|       73       |  Fastify  |    JS    |   41,772   |     11,825     |
|       81       |  NestJS   |    TS    |   37,927   |     9,622      |
|       98       |    Koa    |    JS    |   28,691   |     9,017      |
|      100       |  Express  |    JS    |   15,846   |     8,537      |

[These same results](https://www.techempower.com/benchmarks/#section=data-r20&hw=cl&test=fortune&l=yykhdr-sd) show that a combination of Nest, Fastify, and Postgres returned the highest responses per second for Nest implementations in the Fortunes test, just behind NodeJS, and all Nest implementations were faster than plain Express.

Nest's [own benchmark test](https://github.com/nestjs/nest/pull/8607/checks?check_run_id=4223535959) that runs for each PR also show that the Fastify implementation is roughly 4 times faster than Express.

## Vue

Below is a summary of the geometric means reflecting the performance of some frontends in each category tested by [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark), according to [official results for Chrome 98](https://krausest.github.io/js-framework-benchmark/index.html).

| Test Category (Keyed) | Vanilla JS | Solid | Vue  | Angular | React |
| :-------------------- | :--------: | :---: | :--: | :-----: | :---: |
| Duration in ms        |    1.02    | 1.06  | 1.25 |  1.86   | 1.95  |
| Startup Metrics       |    1.07    | 1.06  | 1.26 |  1.78   | 1.66  |
| Memory in MB          |    1.06    | 1.47  | 2.10 |  2.89   | 2.80  |

## Mercurius (GraphQL)

Below is a summary of the performance of some GraphQL servers from [benawad/node-graphql-benchmarks](https://github.com/benawad/node-graphql-benchmarks).

| Server                        | Requests/s | Latency | Throughput/Mb |
| :---------------------------- | :--------: | :-----: | :-----------: |
| core-graphql-jit-str          |   9383.2   |  0.04   |     58.33     |
| mercurius+graphql-jit         |   8790.0   |  0.04   |     55.03     |
| mercurius                     |   5249.2   |  0.30   |     32.87     |
| fastify-express-graphql-jit   |   4658.8   |  0.36   |     1.28      |
| express-graphql+graphql-jit   |   4038.0   |  0.48   |     25.54     |
| apollo-server-express         |   2486.2   |  1.48   |     15.80     |
| apollo-server-express-tracing |   1505.6   |  2.87   |     47.90     |
