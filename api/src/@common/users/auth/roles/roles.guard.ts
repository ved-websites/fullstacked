import { ContextService } from '$context/context.service';
import { TypedI18nService } from '$i18n/i18n.service';
import { PrismaService } from '$prisma/prisma.service';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { LuciaUser } from '../session.decorator';
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

		const user = ContextService.getUser(context);

		if (!user) {
			// If no session, don't handle
			return true;
		}

		const hasRole = await this.userHasDefinedRoles(user, definedRoles);

		if (!hasRole) {
			const errorMessage = this.i18n.t('auth.errors.roles.does-not-have-role');

			if (context.getType() === 'ws') {
				throw new WsException(errorMessage);
			}

			throw new ForbiddenException(errorMessage);
		}

		return true;
	}

	protected async userHasDefinedRoles(user: LuciaUser, definedRoles: string[]) {
		const { roles } = await this.prisma.user.findFirstOrThrow({
			where: {
				id: user.id,
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
			return false;
		}

		return true;
	}
}

export const Roles = Reflector.createDecorator<[string, ...string[]]>();
