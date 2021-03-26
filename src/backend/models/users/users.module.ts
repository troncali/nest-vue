// https://blog.logrocket.com/how-to-build-a-graphql-api-with-nestjs/
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from "./users.controller";
import { UsersRepository } from "./providers/users.repository";
import { UsersResolver } from "./providers/users.resolver";
import { UsersService } from "./providers/users.service";

@Module({
	imports: [TypeOrmModule.forFeature([UsersRepository])],
	controllers: [UsersController],
	providers: [UsersService, UsersResolver],
	exports: [UsersService]
})
export class UsersModule {}
