import { TypedI18nModule } from '$i18n/i18n.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
	imports: [HttpModule, TypedI18nModule],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
