import { CryptoModule } from '$crypto/crypto.module';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CookieService } from '../cookie.service';
import { SessionMiddleware } from './session.middleware';
import { SessionService } from './session.service';
import { SessionTasks } from './session.tasks';

@Global()
@Module({
	imports: [CryptoModule],
	providers: [CookieService, SessionService, SessionTasks],
	exports: [CookieService, SessionService],
})
export class SessionModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SessionMiddleware).forRoutes('{*slug}');
	}
}
