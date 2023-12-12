import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
	providers: [MessageResolver, MessageService],
})
export class MessageModule {}
