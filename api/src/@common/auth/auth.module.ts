import { LuciaModule } from '$common/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
	imports: [LuciaModule],
	providers: [AuthResolver, AuthService],
})
export class AuthModule {}
