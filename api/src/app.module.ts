import { ConfigModule } from '$common/configs/config.module';
import { GraphQLModule } from '$common/graphql.module';
import { PrismaModule } from '$common/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';

@Module({
	imports: [ConfigModule, PrismaModule, GraphQLModule, MessageModule],
	providers: [],
})
export class AppModule {}
