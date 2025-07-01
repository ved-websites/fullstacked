import { ConfigModule } from '$configs/config.module';
import { ContextModule } from '$context/context.module';
import { EmailModule } from '$email/email.module';
import { EventsModule } from '$events/events.module';
import { HealthModule } from '$health/health.module';
import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { SentryModule } from '$sentry/sentry.module';
import { SocketModule } from '$socket/socket.module';
import { UsersModule } from '$users/users.module';
import { ModuleMetadata } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { HomeModule } from './home/home.module';
import { throttlerConf } from './throttler.guard';

export const BaseModules = [
	ConfigModule,
	HealthModule,
	SentryModule,
	PrismaModule,
	ContextModule,
	SocketModule,
	EventsModule,
	ThrottlerModule.forRoot(throttlerConf),
	UsersModule,
	EmailModule,
	HomeModule,
	TypedI18nModule,
] satisfies ModuleMetadata['imports'];
