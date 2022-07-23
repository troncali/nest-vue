import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PrismaService } from "@libs/nest/providers/db/src/lib/prisma/default.service";
import { Session } from "../session.entity";
import { SessionSeederService } from "./session.seeder.service";

/**
 * Import and provide Session-related seeder classes.
 *
 * @module
 */
@Module({
	imports: [TypeOrmModule.forFeature([Session])],
	providers: [SessionSeederService, PrismaService],
	exports: [SessionSeederService, TypeOrmModule]
})
export class SessionSeeder {}
