import { AuthenticationMiddleware } from '$common/lucia/lucia.middleware';
import { LuciaModule } from '$common/lucia/lucia.module';
import { Module, NestModule, type MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
	imports: [LuciaModule],
	providers: [AuthenticationMiddleware, AuthService, AuthResolver],
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticationMiddleware).forRoutes('*');
	}
}
