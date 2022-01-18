import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Session1617686200270 } from "@vxnn/models/session";
import { User1616910769703 } from "@vxnn/models/user";

import { DbConfigModule } from "@vxnn/nest/config/db";
import { DefaultDbConfigService } from "@vxnn/nest/config/db";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [DbConfigModule],
			useExisting: DefaultDbConfigService
		}),
		// TODO: (remove) temporary fix for circular dependency for migrations until Prisma
		User1616910769703,
		Session1617686200270
	]
})
export class DatabaseProvider {}
