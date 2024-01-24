import { TypedI18nModule } from '$i18n/i18n.module';
import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
	imports: [TypedI18nModule],
	providers: [MessageService, MessageGateway],
	controllers: [MessageController],
	exports: [MessageService],
})
export class MessageModule {}
