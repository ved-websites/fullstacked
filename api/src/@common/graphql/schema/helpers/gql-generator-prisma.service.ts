import { PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GQLGeneratorPrismaService extends PrismaService {
	override async onModuleInit(): Promise<void> {
		// Do nothing on init (GQL Generation does not need to be connected)
	}

	override async onModuleDestroy(): Promise<void> {
		// Do nothing on destroy (GQL Generation is not connected to db so no need to disconnect)
	}
}
