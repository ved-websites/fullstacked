import { Global, Module } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { EnvironmentConfig } from '~env';
import { PrismaConstructorOptions, PrismaOptionsInjectToken, PrismaService } from './prisma.service';

@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: PrismaOptionsInjectToken,
			useFactory: (env: EnvironmentConfig): PrismaConstructorOptions => {
				const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

				return [{ adapter }];
			},
			inject: [EnvironmentConfig],
		},
	],
	exports: [PrismaService],
})
export class PrismaModule {}
