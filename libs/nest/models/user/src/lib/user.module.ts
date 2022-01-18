// https://blog.logrocket.com/how-to-build-a-graphql-api-with-nestjs/
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./user.controller";
import { UserRepository } from "./providers/user.repository";
import { UserResolver } from "./providers/user.resolver";
import { UserService } from "./providers/user.service";
import { SessionModule } from "@vxnn/models/session";
import { CipherProvider } from "@vxnn/nest/providers/cipher";

/**
 * Import and provide user-related classes.
 *
 * @module
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([UserRepository]),
		forwardRef(() => SessionModule)
	],
	controllers: [UserController],
	providers: [UserService, UserResolver, CipherProvider],
	exports: [UserService, TypeOrmModule]
})
export class UserModule {}
