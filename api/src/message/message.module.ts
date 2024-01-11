import { TypedI18nModule } from '$i18n/i18n.module';
import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
	imports: [TypedI18nModule],
	providers: [MessageResolver, MessageService, MessageGateway],
	controllers: [MessageController],
})
export class MessageModule {}
