import { PrismaService } from '$common/prisma/prisma.service';
import { getGraphQLRequest } from '$common/utils/contextExtracter';
import { CanActivate, ExecutionContext, Inject, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector, @Inject(PrismaService) private readonly prisma: PrismaService) {}

	async canActivate(context: ExecutionContext) {
		const definedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

		if (!definedRoles) {
			return true;
		}

		const { session } = getGraphQLRequest(context);

		if (!session) {
			// If no session, don't handle
			return true;
		}

		const { roles } = await this.prisma.user.findFirstOrThrow({
			where: {
				id: session.user.id,
			},
			select: {
				roles: true,
			},
		});

		return definedRoles.some((definedRole) => roles.some((role) => role.text === definedRole));
	}
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [string, ...string[]]) => SetMetadata(ROLES_KEY, roles);
