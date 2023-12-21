import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
	providers: [MessageResolver, MessageService],
	controllers: [MessageController],
})
export class MessageModule {}
