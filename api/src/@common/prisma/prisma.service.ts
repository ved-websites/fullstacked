import { isLocal } from '$configs/helpers';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ExtendedPrismaClient } from './prisma.extended-client';

export const PrismaOptionsInjectToken = 'PRISMA_OPTIONS';
export type PrismaConstructorOptions = ConstructorParameters<typeof ExtendedPrismaClient>;

@Injectable()
export class PrismaService extends ExtendedPrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor(@Inject(PrismaOptionsInjectToken) prismaArgs: PrismaConstructorOptions) {
		super(...prismaArgs);
	}

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
