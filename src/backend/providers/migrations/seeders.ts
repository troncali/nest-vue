import { Module } from "@nestjs/common";

import { DatabaseProvider } from "../database.provider";
import { SeedProvider } from "./seed.provider";
import { UsersSeeder } from "@/backend/models/users/migrations/users.seeder";

/**
 * Import and provide seed-related classes.
 *
 * @module
 */
@Module({
	imports: [DatabaseProvider, UsersSeeder],
	providers: [SeedProvider]
})
export class Seeders {}
