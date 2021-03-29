import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersRepository } from "../providers/users.repository";
import { UsersSeederService } from "./users.seeder.service";

/**
 * Import and provide User-related seeder classes.
 *
 * @module
 */
@Module({
	imports: [TypeOrmModule.forFeature([UsersRepository])],
	providers: [UsersSeederService],
	exports: [UsersSeederService]
})
export class UsersSeeder {}
