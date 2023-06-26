import { AuthModule } from '$auth/auth.module';
import { RolesModule } from '$auth/roles/roles.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
	imports: [PrismaModule, AuthModule, RolesModule],
	providers: [UsersResolver, UsersService],
})
export class UsersModule {}
