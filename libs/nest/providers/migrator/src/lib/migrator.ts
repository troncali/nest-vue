import { Module } from "@nestjs/common";

import { DatabaseProvider } from "@vxnn/nest/providers/db";
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
