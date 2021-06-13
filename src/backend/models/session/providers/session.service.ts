import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions } from "typeorm";

import { BaseModelService } from "../../base.service";
import { User } from "../../user/user.entity";
import { UserSession } from "../session.dto";
import { Session } from "../session.entity";
import { SessionRepository } from "./session.repository";

/**
 * Model service for `Session` entity.
 *
 * @class
 */
@Injectable()
export class SessionService extends BaseModelService<Session> {
	/**
	 * Initialize service dependencies.
	 * @param sessionRepo The injected `SessionRepository` instance.
	 */
	constructor(private readonly sessionRepo: SessionRepository) {
		super();
	}

	/**
	 * Get a specific set of fields for one or more `Session` UUIDs.
	 * @param ids One or more UUIDs to find.
	 * @param fields Fields of the `Session` entity to include in response.
	 * @example sessionService.query(id, ["userId"])
	 * @returns A single `Session` record, or an array of `Session` records.
	 */
	async query(
		ids: string | string[],
		fields: (keyof Session)[]
	): Promise<Partial<Session> | Partial<Session>[] | undefined> {
		const result = await this.getFieldsForIds(
			this.sessionRepo,
			ids,
			fields,
			Session
		);
		return result;
	}

	/**
	 * Create a new `Session` for the provided `User`.
	 * @param user The `User` entity for which a `Session` will be created.
	 * @returns A `UserSession` DTO.
	 */
	async create(user: User): Promise<UserSession> {
		const session = await this.sessionRepo.save({ user });
		delete user.password;
		return { ...user, sessionId: session.id };
	}

	/**
	 * Get a `Session` record.
	 * @param ids One or more UUIDs to find.
	 * @returns A single `Session` record, or an array of `Session` records.
	 */
	async getByIds(ids: string | string[]): Promise<Session | Session[]> {
		const sessions = await this.getOneOrMoreIds(this.sessionRepo, ids);
		if (!sessions) throw new Error("No session found.");
		return sessions;
	}

	/**
	 * Find a `Session` record using all available TypeORM options.
	 * @param findOptions The TypeORM find options to apply.
	 * @example sessionService.find({ where: { id }, select: ["userId"] })
	 * @returns A single `Session` record, or an array of `Session` records.
	 */
	async find(findOptions: FindManyOptions) {
		return await this.sessionRepo.find(findOptions);
	}
}
