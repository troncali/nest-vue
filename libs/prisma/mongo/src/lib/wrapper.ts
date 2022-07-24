import { PrismaWrapper } from "@nest-vue/prisma/wrapper";
import { MongoUrl } from "@libs/nest/config/db/src/lib/connections";

/** Invokes the PrismaWrapper for a MongoDB connection. */
PrismaWrapper(process.argv.slice(2), MongoUrl);
