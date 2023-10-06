import { ConfigModule } from '$configs/config.module';
import { ContextModule } from '$graphql/context/context.module';
import { GraphQLModule } from '$graphql/graphql.module';
import { TypedI18nModule } from '$i18n/i18n.module';
import { PrismaModule } from '$prisma/prisma.module';
import { UsersModule } from '$users/users.module';
import { ModuleMetadata } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HomeModule } from './home/home.module';

export const BaseModules = [
	ConfigModule,
	PrismaModule,
	GraphQLModule,
	ContextModule,
	EventEmitterModule.forRoot({
		global: true,
		verboseMemoryLeak: true,
	}),
	UsersModule,
	HomeModule,
	TypedI18nModule,
] satisfies ModuleMetadata['imports'];
