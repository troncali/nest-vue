import {
	ClassConstructor,
	ClassTransformOptions,
	plainToClass
} from "class-transformer";
import { GraphQLResolveInfo, SelectionNode } from "graphql";
import {
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhereProperty,
	In,
	Repository
} from "typeorm";

/**
 * Establish methods for all Model services.
 */
export abstract class BaseModelService<T extends { id: any }> {
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
		repository: Repository<T>,
		ids:
			| FindOptionsWhereProperty<NonNullable<T["id"]>>
			| FindOptionsWhereProperty<NonNullable<T["id"]>>[],
		fields: (keyof T)[],
		dto: ClassConstructor<Partial<T>>,
		findOptions: FindOneOptions<T> | FindManyOptions<T> = {}
		// transformOptions: ClassTransformOptions = {}
	): Promise<Partial<T> | Partial<T>[] | undefined> {
		// Set fields and query
		findOptions.select
			? (findOptions.select = { ...findOptions.select, ...fields })
			: (findOptions.select = fields);
		const items = await this.getOneOrMoreIds(repository, ids, findOptions);

		// TODO: improve errors from TypeORM transactions
		if (!items) throw new Error("No user found.");

		// Transform based on model entity or safe DTO and return data
		// const transformed = await this.transform(dto, items, transformOptions);

		return items.length == 1 ? items[0] : items;
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
			.concat(["dbId", "id"]) // always include id fields for nest queries
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
		repository: Repository<T>,
		ids:
			| FindOptionsWhereProperty<NonNullable<T["id"]>>
			| FindOptionsWhereProperty<NonNullable<T["id"]>>[],
		options?: FindOneOptions<T> | FindManyOptions<T>
	) {
		return typeof ids === "string"
			? await repository.find({ where: { id: ids }, ...options })
			: await repository.find({
					where: { id: In(ids) },
					...options
			  } as FindManyOptions);
	}

	/**
	 * Tranforms data returned by TypeORM into the desired DTO. Only properties
	 * defined on the DTO with the `@Expose()` decorator will be included in the
	 * final object.
	 *
	 * @param dto Target DTO class.
	 * @param data Data to filter into the DTO class.
	 * @param options Class-transformer options to apply;
	 * `excludeExtraneousValues` will always be added or overwritten as `true`
	 * so that only exposed DTO properties remain in the final object.
	 *
	 * @example
	 * const user = await this.usersRepo.findOne(id);
	 * return await this.usersRepo.transform(BasicSafeUserDto, user);
	 */
	async transform<U>(
		dto: ClassConstructor<U>,
		data: T,
		options?: ClassTransformOptions
	): Promise<U>;
	async transform<U>(
		dto: ClassConstructor<U>,
		data: T[],
		options?: ClassTransformOptions
	): Promise<U[]>;
	async transform<U>(
		dto: ClassConstructor<U>,
		data: T | T[],
		options?: ClassTransformOptions
	): Promise<U | U[]>;
	async transform<U>(
		dto: ClassConstructor<U>,
		data: T | T[],
		options: ClassTransformOptions = {}
	): Promise<U | U[]> {
		options.excludeExtraneousValues = true;
		return plainToClass(dto, data, options);
	}

	// Methods below help return columns where `select: false` option is set in
	// the entity property's `@Column()` decorator.
	// See https://github.com/typeorm/typeorm/issues/5816#issuecomment-787787989

	/**
	 * Returns an array of all column names for the entity, including columns
	 * where `select: false` option is set. This allows sensitive or uncommon
	 * columns to be excluded from the query by default unless explicitly
	 * requested.
	 *
	 * @example
	 * this.usersRepo.findById(id, { select: this.usersRepo.allColumns() })
	 */
	public allColumns(repository: Repository<T>): (keyof T)[] {
		return repository.metadata.columns.map(
			(col) => col.propertyName
		) as (keyof T)[];
	}

	/**
	 * Returns an array of all column names for the entity where the column
	 * option `select: false` is set. This allows sensitive or uncommon columns
	 * to be excluded from the query by default unless explicitly requested.
	 *
	 * @example
	 * this.usersRepo.findById(id, { select: this.usersRepo.onlyUnselectedColumns() })
	 */
	public onlyUnselectedColumns(repository: Repository<T>): (keyof T)[] {
		return repository.metadata.columns
			.filter((col) => col.isSelect === false)
			.map((col) => col.propertyName) as (keyof T)[];
	}

	/**
	 * Returns all columns for an entity or array of entities matching provided
	 * `id`s, including columns where option `select: false` is set. This allows
	 * sensitive or uncommon columns to be excluded from the query by default
	 * unless explicitly requested through this method.
	 *
	 * @param ids A single `id` or an array of `id`s to include in query.
	 * @param options Query options to apply; `select` will always be added or
	 * overwritten to include unselected columns.
	 *
	 * @example this.usersRepo.getAllColumnsForIds(id);
	 * this.usersRepo.getAllColumnsForIds([id_a, id_b]);
	 */
	async getAllColumnsForIds(
		repository: Repository<T>,
		ids:
			| FindOptionsWhereProperty<NonNullable<T["id"]>>
			| FindOptionsWhereProperty<NonNullable<T["id"]>>[],
		options: FindOneOptions<T> | FindManyOptions<T> = {}
	): Promise<T | T[] | undefined> {
		options.select = this.allColumns(repository);
		return typeof ids === "string"
			? await repository.find({ where: { id: ids }, ...options })
			: await repository.find({
					where: { id: In(ids) },
					...options
			  } as FindManyOptions);
	}
}
