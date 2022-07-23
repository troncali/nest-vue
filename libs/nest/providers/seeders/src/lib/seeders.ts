import { Module } from "@nestjs/common";

import { DatabaseProvider } from "@nest-vue/nest/providers/db";
import { SessionSeeder } from "@nest-vue/models/session";
import { UserSeeder } from "@nest-vue/models/user";

import { SeedProvider } from "./seed.provider";

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
