import { ConfigModule } from '$common/configs/config.module';
import { GraphQLModule } from '$common/graphql.module';
import { PrismaModule } from '$common/prisma/prisma.module';
import { Module, type ModuleMetadata } from '@nestjs/common';
import { AuthModule } from './@common/auth/auth.module';
import { MessageModule } from './message/message.module';

const AppImports: ModuleMetadata['imports'] = [MessageModule];

@Module({
	imports: [ConfigModule, PrismaModule, GraphQLModule, AuthModule, ...AppImports],
	providers: [],
})
export class AppModule {}
