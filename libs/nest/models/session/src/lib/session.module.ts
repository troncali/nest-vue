// https://blog.logrocket.com/how-to-build-a-graphql-api-with-nestjs/
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserModule } from "@nest-vue/models/user";

import { Session } from "./session.entity";
import { SessionResolver } from "./providers/session.resolver";
import { SessionService } from "./providers/session.service";

/**
 * Import and provide session-related classes.
 *
 * @module
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([Session]),
		forwardRef(() => UserModule)
	],
	providers: [SessionService, SessionResolver],
	exports: [SessionService, TypeOrmModule]
})
export class SessionModule {}
