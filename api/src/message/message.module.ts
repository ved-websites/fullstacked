import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
	providers: [MessageService, MessageGateway],
	controllers: [MessageController],
	exports: [MessageService],
})
export class MessageModule {}
