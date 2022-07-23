import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AppConfigModule } from "@nest-vue/nest/config/app";
import { CipherProvider } from "@nest-vue/nest/providers/cipher";
import { SessionModule } from "@nest-vue/models/session";
import { UserModule } from "@nest-vue/models/user";

import { AuthController } from "./auth.controller";
import { AuthService } from "./providers/auth.service";

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
