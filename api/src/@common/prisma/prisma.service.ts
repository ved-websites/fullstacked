import { PrismaClient } from '$prisma-client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import { getDMMF, getSchemaPath } from '@prisma/internals';
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

async function getPrismaDMMF() {
	const schemaPath = await getSchemaPath();

	const dmmf = await getDMMF({
		datamodelPath: schemaPath!,
	});

	return dmmf;
}

const promisedDMMF = getPrismaDMMF();

export async function getPrismaSelector(info: GraphQLResolveInfo) {
	const dmmf = await promisedDMMF;

	return new PrismaSelect(info, {
		dmmf: [dmmf],
	}).value;
}
