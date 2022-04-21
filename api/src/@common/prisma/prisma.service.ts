import { Prisma, PrismaClient } from '$prisma-client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import type { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}
}

export function getPrismaSelector(info: GraphQLResolveInfo) {
	return new PrismaSelect(info, {
		dmmf: [Prisma.dmmf],
	}).value;
}
