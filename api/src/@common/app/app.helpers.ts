import { AuthModule } from '$auth/auth.module';
import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { GraphQLModule } from '$graphql/graphql.module';
import { PrismaModule } from '$prisma/prisma.module';
import { ModuleMetadata } from '@nestjs/common';

export const BaseModules = [ConfigModule, EmailModule, PrismaModule, GraphQLModule, AuthModule] satisfies ModuleMetadata['imports'];
