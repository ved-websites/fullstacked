import { LuciaModule } from '$auth/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { ContextService } from './context.service';

@Module({
	imports: [LuciaModule, ContextModule],
	providers: [ContextService],
	exports: [ContextService],
})
export class ContextModule {}
