import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LuciaModule } from './lucia/lucia.module';

@Module({
	imports: [LuciaModule],
	providers: [
		AuthResolver,
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	exports: [AuthService],
})
export class AuthModule {}
