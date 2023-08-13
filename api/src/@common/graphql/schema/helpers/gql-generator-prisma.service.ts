import { PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GQLGeneratorPrismaService extends PrismaService {
	override async onApplicationBootstrap(): Promise<void> {
		// Do nothing on bootstrap (GQL Generation does not need to be connected)
	}
}
