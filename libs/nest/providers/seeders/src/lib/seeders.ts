import { Module } from "@nestjs/common";

import { DatabaseProvider } from "@vxnn/nest/providers/db";
import { SeedProvider } from "./seed.provider";
import { UserSeeder } from "@vxnn/models/user";
import { SessionSeeder } from "@vxnn/models/session";

/**
 * Import and provide seed-related classes.
 *
 * @module
 */
@Module({
	imports: [DatabaseProvider, UserSeeder, SessionSeeder],
	providers: [SeedProvider]
})
export class Seeders {}
