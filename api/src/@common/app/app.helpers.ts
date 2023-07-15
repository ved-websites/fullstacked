import { AuthModule } from '$auth/auth.module';
import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { GraphQLModule } from '$graphql/graphql.module';
import { PrismaModule } from '$prisma/prisma.module';
import { UsersModule } from '$users/users.module';
import { ModuleMetadata } from '@nestjs/common';

export const BaseModules = [
	ConfigModule,
	EmailModule,
	PrismaModule,
	GraphQLModule,
	AuthModule,
	UsersModule,
] satisfies ModuleMetadata['imports'];
