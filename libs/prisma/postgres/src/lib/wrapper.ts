import { PrismaWrapper } from "@nest-vue/prisma/wrapper";
import { PostgresUrl } from "@libs/nest/config/db/src/lib/connections";

/** Invokes the PrismaWrapper for a PostgreSQL connection. */
PrismaWrapper(process.argv.slice(2), PostgresUrl);
