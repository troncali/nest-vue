import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { User } from "./users/user.entity";
import { Users1616910769703 } from "./users/migrations/1616910769703-Users.migration";

export const ModelIndex: ModelIndexInterface = {
	entities: [User],
	migrations: [Users1616910769703],
	getList: function (listType) {
		return this[listType];
	}
};

interface ModelIndexInterface {
	entities: EntityClassOrSchema[];
	migrations: any[];
	getList: (
		listType: "entities" | "migrations"
	) => (EntityClassOrSchema | any)[];
}
