import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/**
 * Authenticates an asserted email and password. Implements `local` Passport
 * strategy.
 */
@Injectable()
export class EmailAuthGuard extends AuthGuard("local") {}
