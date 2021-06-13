import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { User } from "./user/user.entity";
import { User1616910769703 } from "./user/migrations/1616910769703-User.migration";
import { Session } from "./session/session.entity";
import { Session1617686200270 } from "./session/migrations/1617686200270-Session.migration";

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
