import { EntityRepository } from "typeorm";

import { BaseRepository } from "@vxnn/models/base-model";
import { User } from "../user.entity";

/**
 * Establish methods specific to the Users repository.
 * @class
 */
@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
