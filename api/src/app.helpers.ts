import { AuthModule } from '$auth/auth.module';
import { ConfigModule } from '$configs/config.module';
import { GraphQLModule } from '$graphql.module';
import { PrismaModule } from '$prisma/prisma.module';
import { ModuleMetadata } from '@nestjs/common';

export const BaseModules = [ConfigModule, PrismaModule, GraphQLModule, AuthModule] satisfies ModuleMetadata['imports'];
