import { ConfigModule } from '$configs/config.module';
import { ContextModule } from '$context/context.module';
import { EmailModule } from '$email/email.module';
import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { SocketModule } from '$socket/socket.module';
import { UsersModule } from '$users/users.module';
import { ModuleMetadata } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { HomeModule } from './home/home.module';
import { throttlerConf } from './throttler.guard';

export const BaseModules = [
	ConfigModule,
	PrismaModule,
	ContextModule,
	SocketModule,
	EventEmitterModule.forRoot({
		global: true,
		verboseMemoryLeak: true,
	}),
	ThrottlerModule.forRoot(
		throttlerConf.map((conf) => ({
			...conf,
			ttl: typeof conf.ttl === 'number' ? seconds(conf.ttl) : conf.ttl,
		})),
	),
	UsersModule,
	EmailModule,
	HomeModule,
	TypedI18nModule,
] satisfies ModuleMetadata['imports'];
