import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { ContextService } from './context.service';

@Module({
	imports: [LuciaModule],
	providers: [ContextService],
	exports: [ContextService],
})
export class ContextModule {}
