import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AppConfigModule } from "@vxnn/nest/config/app";
import { SessionModule } from "@vxnn/models/session";
import { UserModule } from "@vxnn/models/user";

import { AuthController } from "./auth.controller";
import { AuthService } from "./providers/auth.service";
import { CipherProvider } from "@vxnn/nest/providers/cipher";

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
