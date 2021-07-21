import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AppConfigModule } from "../config/app/config.module";
import { SessionModule } from "../models/session/session.module";
import { UserModule } from "../models/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./providers/auth.service";
import { CipherProvider } from "../providers/cipher.provider";

import { EmailStrategy } from "./strategies/email.strategy";
import { SessionStrategy } from "./strategies/session.strategy";

/**
 * Import and provide authentication-related classes.
 *
 * @module
 */
@Module({
	imports: [UserModule, SessionModule, PassportModule, AppConfigModule],
	controllers: [AuthController],
	providers: [AuthService, CipherProvider, EmailStrategy, SessionStrategy]
})
export class AuthModule {}

// TODO: use fastify-passport?
// TODO: add check for revoked sessionId
