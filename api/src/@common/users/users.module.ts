import { AuthModule } from '$auth/auth.module';
import { RolesModule } from '$auth/roles/roles.module';
import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
	imports: [ConfigModule, PrismaModule, AuthModule, RolesModule, EmailModule],
	providers: [UsersResolver, UsersService],
})
export class UsersModule {}
