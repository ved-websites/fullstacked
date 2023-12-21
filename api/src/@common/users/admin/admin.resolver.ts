import { getErrorMessage } from '$i18n/i18n.error';
import { User, UserCreateInput, UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { AuthService } from '$users/auth/auth.service';
import { Roles } from '$users/auth/roles/roles.guard';
import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { LiveUser } from '$users/dtos/LiveUser.dto';
import { Origin } from '$utils/origin.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ADMIN } from '~utils/roles';
import { AdminService } from './admin.service';
import { CreateUserOutput } from './dtos/create-user.output';
import { GetUserOutput } from './dtos/getUser.output';

@Roles([ADMIN])
@Resolver()
export class AdminResolver {
	constructor(
		private readonly adminService: AdminService,
		private readonly authService: AuthService,
	) {}

	@Query(() => [LiveUser])
	async getUsers(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where?: UserWhereInput) {
		const users = await this.adminService.getUsers(select, where);

		return users;
	}

	@Query(() => GetUserOutput, { nullable: true })
	async getUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereUniqueInput) {
		const user = await this.adminService.getUser(select, where);

		return user;
	}

	@Mutation(() => CreateUserOutput)
	async createUser(@Args('data') data: UserCreateInput, @AuthSession() { user }: LuciaSession, @Origin() origin: string) {
		const newUser = await this.adminService.createUser(data, { url: origin, user });

		return newUser satisfies CreateUserOutput;
	}

	@Mutation(() => User)
	async editUser(
		@I18n() i18n: I18nContext,
		@SelectQL() select: PrismaSelector,
		@Args('where') where: UserWhereUniqueInput,
		@Args('data') data: UserUpdateInput,
	) {
		try {
			const editedUser = await this.adminService.editUser(select, where, data);

			return editedUser;
		} catch (error) {
			const message = getErrorMessage(error, i18n);

			throw new ForbiddenException(message);
		}
	}

	@Mutation(() => GetUserOutput, { nullable: true })
	async deleteUser(@I18n() i18n: I18nContext, @SelectQL() select: PrismaSelector, @Args('where') where: UserWhereUniqueInput) {
		try {
			const deletedUser = await this.adminService.deleteUser(select, where);

			return deletedUser;
		} catch (error) {
			const message = getErrorMessage(error, i18n);

			throw new ForbiddenException(message);
		}
	}

	@Mutation(() => Boolean)
	async resendNewUserEmail(@Args('where') where: UserWhereUniqueInput, @AuthSession() { user }: LuciaSession, @Origin() origin: string) {
		try {
			const dbUserToResendTo = await this.adminService.getUser({}, where);

			if (!dbUserToResendTo) {
				return false;
			}

			const userToResendTo = await this.authService.getLuciaUser(dbUserToResendTo.id);

			await this.adminService.sendNewUserRegistrationEmail(userToResendTo, { url: origin, user });

			return true;
		} catch (error) {
			return false;
		}
	}
}
