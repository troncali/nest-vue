// https://blog.logrocket.com/how-to-build-a-graphql-api-with-nestjs/
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CipherProvider } from "@nest-vue/nest/providers/cipher";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SessionModule } from "@nest-vue/models/session";

import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserResolver } from "./providers/user.resolver";
import { UserService } from "./providers/user.service";

/**
 * Import and provide user-related classes.
 *
 * @module
 */
@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		forwardRef(() => SessionModule)
	],
	controllers: [UserController],
	providers: [UserService, UserResolver, CipherProvider],
	exports: [UserService, TypeOrmModule]
})
export class UserModule {}
