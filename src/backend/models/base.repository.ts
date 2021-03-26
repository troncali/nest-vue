import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import {
	ClassConstructor,
	ClassTransformOptions,
	plainToClass
} from "class-transformer";

/**
 * Establish methods for all repositories.
 */
export class BaseRepository<T> extends Repository<T> {
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
	public allColumns(): (keyof T)[] {
		return this.metadata.columns.map(
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
	public onlyUnselectedColumns(): (keyof T)[] {
		return this.metadata.columns
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
		ids: string | any[],
		options: FindOneOptions<T> | FindManyOptions<T> = {}
	): Promise<T | T[] | undefined> {
		options.select = this.allColumns();
		if (typeof ids === "string") return this.findOne(ids, options);
		return this.findByIds(ids, options);
	}
}
