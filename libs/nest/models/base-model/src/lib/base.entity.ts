/** Defines the base structure of model entities. */
export class BaseModelEntity {
	/** Require entities to have an internal database identifier. */
	dbId!: number;
	/** Require entities to have a public-facing identifier. */
	id!: string;
}
