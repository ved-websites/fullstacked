import { AuthModule } from '$auth/auth.module';
import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { ContextModule } from '$graphql/context/context.module';
import { GraphQLModule } from '$graphql/graphql.module';
import { PrismaModule } from '$prisma/prisma.module';
import { UsersModule } from '$users/users.module';
import { ModuleMetadata } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

export const BaseModules = [
	ConfigModule,
	EmailModule,
	PrismaModule,
	GraphQLModule,
	ContextModule,
	EventEmitterModule.forRoot({
		global: true,
		verboseMemoryLeak: true,
	}),
	AuthModule,
	UsersModule,
] satisfies ModuleMetadata['imports'];
