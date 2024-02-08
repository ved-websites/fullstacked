import { isLocal } from '$configs/helpers';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ExtendedPrismaClient } from './prisma.extended-client';

@Injectable()
export class PrismaService extends ExtendedPrismaClient implements OnModuleInit, OnModuleDestroy {
	async onModuleInit(): Promise<void> {
		await this.$connect().catch((error) => {
			if (isLocal) {
				return;
			}

			throw error;
		});
	}

	async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}
}
