import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Version
} from "@nestjs/common";

import { LoginUserDto } from "./user.dto";
import { UserService } from "./providers/user.service";

/** User-related routing, prefixed with `/{BACKEND_BASE_PATH}/{version}/user/` */
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
	@Version("1")
	async get(@Param("id") id: string) {
		return await this.userService.getByIds(id);
	}

	/**
	 * Create a `User` record: `/user/create`
	 * @param body The request body.
	 * @returns A `User` record.
	 */
	@Post("/create")
	@Version("1")
	async create(@Body() body: LoginUserDto) {
		return await this.userService
			.create(body.email, body.password)
			.catch(({ message, detail }) => {
				throw new HttpException(
					{ message, detail },
					HttpStatus.UNPROCESSABLE_ENTITY
				);
			});
	}
}
