import { TypedI18nModule } from '$i18n/i18n.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { Module } from '@nestjs/common';
import { ContextService } from './context.service';

@Module({
	imports: [LuciaModule, TypedI18nModule],
	providers: [ContextService],
	exports: [ContextService],
})
export class ContextModule {}
