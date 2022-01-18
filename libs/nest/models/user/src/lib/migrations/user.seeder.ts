import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserRepository } from "../providers/user.repository";
import { UserSeederService } from "./user.seeder.service";

/**
 * Import and provide User-related seeder classes.
 *
 * @module
 */
@Module({
	imports: [TypeOrmModule.forFeature([UserRepository])],
	providers: [UserSeederService],
	exports: [UserSeederService, TypeOrmModule]
})
export class UserSeeder {}
