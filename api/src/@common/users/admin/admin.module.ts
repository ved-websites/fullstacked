import { PrismaModule } from '$prisma/prisma.module';
import { AuthModule } from '$users/auth/auth.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { EmailModule } from '$users/email/email.module';
import { Module } from '@nestjs/common';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { AdminListener } from './listeners/admin.listener';

@Module({
	imports: [PrismaModule, AuthModule, RolesModule, EmailModule],
	providers: [AdminResolver, AdminService, AdminListener],
})
export class AdminModule {}