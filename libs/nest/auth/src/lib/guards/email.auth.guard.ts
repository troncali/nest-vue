import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/**
 * Authenticates an asserted email and password. Implements `local` Passport
 * strategy if `fastify-session` strategy does not find an active session.
 */
@Injectable()
export class EmailAuthGuard extends AuthGuard(["fastify-session", "local"]) {}
