import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PrismaService } from "@libs/nest/providers/db/src/lib/prisma/default.service";
import { User } from "../user.entity";
import { UserSeederService } from "./user.seeder.service";

/**
 * Import and provide User-related seeder classes.
 *
 * @module
 */
@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserSeederService, PrismaService],
	exports: [UserSeederService, TypeOrmModule]
})
export class UserSeeder {}
