import { ClassConstructor, ClassTransformOptions } from "class-transformer";
import { GraphQLResolveInfo, SelectionNode } from "graphql";
import { FindManyOptions, FindOneOptions } from "typeorm";

import { BaseRepository } from "./base.repository";
/**
 * Establish methods for all Model services.
 */
export abstract class BaseModelService<T> {
	/**
	 * Dynamically queries database based on exact fields included in GraphQL
	 * query.
	 * - TLDR: https://stackoverflow.com/questions/58550958/get-list-of-requested-keys-in-nestjs-graphql-request
	 * - Background: https://www.prisma.io/blog/graphql-server-basics-demystifying-the-info-argument-in-graphql-resolvers-6f26249f613a
	 *
	 * @param repository The entity repository - e.g., `this.usersRepo`.
	 * @param ids A single `id` or an array of `id`s queried in GraphQL request.
	 * @param fields The fields queried in GraphQL request.
	 * @param dto Target DTO class.
	 * @param findOptions TypeORM find options to apply. If `select` option is
	 * passed, `fields` will be added; otherwise, `select` will be set to
	 * `fields`.
	 * @param transformOptions Class-transformer options to apply;
	 * `excludeExtraneousValues` will always be added or overwritten as `true`
	 * so that only exposed DTO properties remain in the final object.
	 */
	async getFieldsForIds(
		repository: BaseRepository<T>,
		ids: string | string[],
		fields: (keyof T)[],
		dto: ClassConstructor<Partial<T>>,
		findOptions: FindOneOptions<T> | FindManyOptions<T> = {},
		transformOptions: ClassTransformOptions = {}
	): Promise<Partial<T> | Partial<T>[] | undefined> {
		// Set fields and query
		findOptions.select
			? findOptions.select.push(...fields)
			: (findOptions.select = fields);
		const items = await this.getOneOrMoreIds(repository, ids, findOptions);

		// TODO: improve errors from TypeORM transactions
		if (!items) throw new Error("No user found.");

		// Transform based on model entity or safe DTO and return data
		return (await repository.transform(
			dto,
			items,
			transformOptions
		)) as Partial<T>;
	}

	/**
	 * Builds list of field names in GraphQL query, mutation, or subscription.
	 * Always include `id` field, which is necessary to resolve nested entities.
	 * @param info Current instance of GraphQL `info` argument
	 * @example const fields = this.usersService.getFieldNames(info);
	 */
	getFieldNames(info: GraphQLResolveInfo) {
		return info.fieldNodes[0].selectionSet?.selections
			.map((item: SelectionNode) =>
				"name" in item
					? (item.kind === "Field" &&
							item.selectionSet === undefined) ||
					  item.kind === "FragmentSpread"
						? item.name.value
						: null
					: null
			)
			.concat(["id"]) // always include "id" field (for nest queries)
			.filter((item) => (item !== null ? true : false)) as (keyof T)[];
	}

	/**
	 * Runs `findOne` or `findByIds` query depending on whether a single string
	 * `id` or array of `ids` is passed.
	 *
	 * @param repository The entity repository - e.g., `this.usersRepo`.
	 * @param ids A single `id` or an array of `id`s queried in GraphQL request.
	 * @param options TypeORM find options to apply.
	 *
	 * @example
	 * const users = await this.getOneOrMoreIds(this.usersRepo, ids);

	 */
	async getOneOrMoreIds(
		repository: BaseRepository<T>,
		ids: string | string[],
		options?: FindOneOptions<T> | FindManyOptions<T>
	) {
		return typeof ids === "string"
			? await repository.findOne(ids, options)
			: await repository.findByIds(ids, options);
	}
}
