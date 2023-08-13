import { PrismaService } from '$prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AppModule } from '~/app.module';
import { GQLGeneratorPrismaService } from './gql-generator-prisma.service';

@Module({
	imports: [AppModule],
	providers: [
		{
			provide: PrismaService,
			useClass: GQLGeneratorPrismaService,
		},
	],
})
export class GQLGeneratorModule {}
