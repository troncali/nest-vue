import { Controller, Get, Param } from "@nestjs/common";

import { UsersService } from "./providers/users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get("/:id")
	async get(@Param("id") userId: string) {
		return await this.usersService.getByIds(userId);
	}
}
