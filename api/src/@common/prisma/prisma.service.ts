import { isLocal } from '$configs/helpers';
import { PrismaClient } from '$prisma-client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private eventSubsSelectors: Record<string, unknown[] | undefined> = {};

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
