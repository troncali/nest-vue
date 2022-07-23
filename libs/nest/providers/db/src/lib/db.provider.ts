import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
	DbConfigModule,
	DefaultDbConfigService
} from "@nest-vue/nest/config/db";
import { PrismaService } from "./prisma/default.service";

/**
 * Import and provide database-related classes.
 *
 * @module
 */
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [DbConfigModule],
			useExisting: DefaultDbConfigService
		})
	],
	providers: [PrismaService],
	exports: [PrismaService]
})
export class DatabaseProvider {}
