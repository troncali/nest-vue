import { EntityRepository } from "typeorm";

import { BaseRepository } from "@vxnn/models/base-model";
import { Session } from "../session.entity";

/**
 * Establish methods specific to the Session repository.
 * @class
 */
@EntityRepository(Session)
export class SessionRepository extends BaseRepository<Session> {}
