import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
	imports: [PrismaModule],
	providers: [UsersResolver, UsersService],
})
export class UsersModule {}
