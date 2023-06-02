import { Prisma } from '$prisma-client';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Info } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import type { GraphQLResolveInfo } from 'graphql';
import type { PrismaSelector } from './prisma.service';

@Injectable()
export class SelectQLPipe implements PipeTransform<GraphQLResolveInfo, PrismaSelector> {
	transform(info: GraphQLResolveInfo, _metadata: ArgumentMetadata) {
		return new PrismaSelect(info, {
			dmmf: [Prisma.dmmf],
		}).value;
	}
}

export function SelectQL(...args: Parameters<typeof Info>) {
	return Info(SelectQLPipe, ...args);
}
