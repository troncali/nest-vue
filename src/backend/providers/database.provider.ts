import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbConfigModule } from "../config/db/config.module";
import { DefaultDbConfigService } from "../config/db/default-postgres/config.service";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [DbConfigModule],
			useExisting: DefaultDbConfigService
		})
	]
})
export class DatabaseProvider {}
