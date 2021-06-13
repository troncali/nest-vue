import { Controller, Get, Param } from "@nestjs/common";

import { UserService } from "./providers/user.service";

/** User-related routing, prefixed with `/{BACKEND_BASE_PATH}/user/` */
@Controller("user")
export class UserController {
	/**
	 * Initialize controller dependencies.
	 * @param userService The injected `UserService` instance.
	 */
	constructor(private readonly userService: UserService) {}

	/**
	 * Get a `User` record: `/user/{id}`
	 * @param id The User's UUID.
	 */
	@Get("/:id")
	async get(@Param("id") id: string) {
		return await this.userService.getByIds(id);
	}
}
