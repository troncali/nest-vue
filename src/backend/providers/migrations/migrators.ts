import { Module } from "@nestjs/common";

import { DatabaseProvider } from "../database.provider";
import { MigrationProvider } from "./migration.provider";

/**
 * Import and provide migration classes.
 *
 * @module
 */
@Module({
	imports: [DatabaseProvider],
	providers: [MigrationProvider]
})
export class Migrator {}
