import { Module } from "@nestjs/common";

import { DatabaseProvider } from "../database.provider";
import { SeedProvider } from "./seed.provider";
import { UserSeeder } from "../../models/user/migrations/user.seeder";
import { SessionSeeder } from "../../models/session/migrations/session.seeder";

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
