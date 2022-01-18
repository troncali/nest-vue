// https://blog.logrocket.com/how-to-build-a-graphql-api-with-nestjs/
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionRepository } from "./providers/session.repository";
import { SessionResolver } from "./providers/session.resolver";
import { SessionService } from "./providers/session.service";
import { UserModule } from "@vxnn/models/user";

/**
 * Import and provide session-related classes.
 *
 * @module
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([SessionRepository]),
		forwardRef(() => UserModule)
	],
	providers: [SessionService, SessionResolver],
	exports: [SessionService, TypeOrmModule]
})
export class SessionModule {}
