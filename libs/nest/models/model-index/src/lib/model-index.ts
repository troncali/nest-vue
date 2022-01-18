import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { User } from "@vxnn/models/user";
import { User1616910769703 } from "@vxnn/models/user";
import { Session } from "@vxnn/models/session";
import { Session1617686200270 } from "@vxnn/models/session";

/**
 * Centralized index of all model entities and migrations used by the
 * application.
 */
export const ModelIndex: ModelIndexInterface = {
	entities: [User, Session],
	migrations: [User1616910769703, Session1617686200270],
	getList: function (listType) {
		return this[listType];
	}
};

/** Defines properties of the `ModelIndex` */
interface ModelIndexInterface {
	/** All model entities used by the application. */
	entities: EntityClassOrSchema[];

	/** All model migrations used by the application. */
	migrations: any[];

	/**
	 * Provides a list of all indexed model entities or migrations.
	 * @param listType Whether to return a list of entities or migrations.
	 */
	getList: (
		listType: "entities" | "migrations"
	) => (EntityClassOrSchema | any)[];
}
