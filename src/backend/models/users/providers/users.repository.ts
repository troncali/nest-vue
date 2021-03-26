import { EntityRepository } from "typeorm";

import { BaseRepository } from "../../base.repository";
import { User } from "../user.entity";

/**
 * Establish methods specific to the Users repository.
 */
@EntityRepository(User)
export class UsersRepository extends BaseRepository<User> {}
