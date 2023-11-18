import { ContextService } from '$graphql/context/context.service';
import { TypedI18nService } from '$i18n/i18n.service';
import { PrismaService } from '$prisma/prisma.service';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly prisma: PrismaService,
		private readonly rolesService: RolesService,
		private readonly i18n: TypedI18nService,
	) {}

	async canActivate(context: ExecutionContext) {
		const definedRoles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);

		if (!definedRoles) {
			return true;
		}

		const { session } = ContextService.getRequest(context);

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

		const hasRole = this.rolesService.rolesIntersect(
			definedRoles,
			roles.map((role) => role.text),
		);

		if (!hasRole) {
			throw new ForbiddenException(this.i18n.t('auth.errors.roles.does-not-have-role'));
		}

		return true;
	}
}

export const Roles = Reflector.createDecorator<[string, ...string[]]>();
