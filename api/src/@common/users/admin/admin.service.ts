import { UserCreateInput, UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { AuthService } from '$users/auth/auth.service';
import { RolesService } from '$users/auth/roles/roles.service';
import { EmailService } from '$users/email/email.service';
import { Injectable } from '@nestjs/common';
import { User } from 'lucia';
import { ADMIN } from '~/@utils/roles';
import { EnvironmentConfig } from '~/env.validation';

@Injectable()
export class AdminService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly rolesService: RolesService,
		private readonly email: EmailService,
		private readonly env: EnvironmentConfig,
	) {}

	async getUsers(select: PrismaSelector, where?: UserWhereInput) {
		const users = await this.prisma.user.findMany({
			where,
			...select,
			orderBy: {
				createdAt: 'asc',
			},
		});

		return users;
	}

	async getUser(select: PrismaSelector, where: UserWhereInput) {
		const users = await this.prisma.user.findFirst({
			where,
			...select,
		});

		return users;
	}

	async createUser(data: UserCreateInput, options: { origin: string; originUser: User; waitForEmail?: boolean }) {
		const { email, firstName, lastName, roles } = data;

		const user = await this.authService.createUser(email, null, {
			firstName,
			lastName,
		});

		if (roles) {
			await this.rolesService.setUserRoles(user, roles);
		}

		if (user.registerToken) {
			const templateData = {
				name: user.fullName ?? user.email,
				url: `${options.origin}/register?token=${user.registerToken}`,
			};

			const emailer = this.email.renderAndSend(['RegisterEmail.hbs', templateData], {
				to: { email: user.email, name: user.fullName },
				from: { email: this.env.EMAIL_FROM, name: options.originUser.fullName },
				replyTo: { email: options.originUser.email, name: options.originUser.fullName },
				subject: `You have been invited to join the Fullstacked website!`,
			});

			if (options.waitForEmail) {
				await emailer;
			}
		}

		return user;
	}

	async editUser(select: PrismaSelector, where: UserWhereUniqueInput, data: UserUpdateInput) {
		if (data.roles?.set?.every((role) => role.text != ADMIN)) {
			// if no role has admin, check if at least one admin would remain
			const otherAdminsCount = await this.prisma.user.count({
				where: {
					email: {
						not: where.email,
					},
					roles: {
						some: {
							text: {
								equals: ADMIN,
							},
						},
					},
				},
			});

			if (!otherAdminsCount) {
				throw new Error('Cannot remove the admin role on the last admin, make sure to define another user with the admin role first!');
			}
		}

		const updatedUser = await this.prisma.mutate(['USER_EDITED'], select, (allSelect) => {
			return this.prisma.user.update({ where, data, ...allSelect });
		});

		return updatedUser;
	}

	async deleteUser(select: PrismaSelector, where: UserWhereUniqueInput) {
		const otherAdminsCount = await this.prisma.user.count({
			where: {
				email: {
					not: where.email,
				},
				roles: {
					some: {
						text: {
							equals: ADMIN,
						},
					},
				},
			},
		});

		if (!otherAdminsCount) {
			throw new Error('Cannot delete the last admin user, make sure to define another user with the admin role first!');
		}

		const deletedUser = await this.prisma.user.delete({
			where,
			...select,
		});

		return deletedUser;
	}
}
