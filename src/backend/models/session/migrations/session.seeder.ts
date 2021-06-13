import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../../user/providers/user.repository";

import { SessionRepository } from "../providers/session.repository";
import { SessionSeederService } from "./session.seeder.service";

/**
 * Import and provide Session-related seeder classes.
 *
 * @module
 */
@Module({
	imports: [TypeOrmModule.forFeature([SessionRepository, UserRepository])],
	providers: [SessionSeederService],
	exports: [SessionSeederService, TypeOrmModule]
})
export class SessionSeeder {}
