import { PrismaModule } from '$common/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
	imports: [PrismaModule],
	providers: [MessageResolver, MessageService],
})
export class MessageModule {}
