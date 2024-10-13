import { getErrorMessage } from '$i18n/i18n.error';
import { RoleCheck } from '$users/auth/roles/roles.guard';
import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { Origin } from '$utils/origin.decorator';
import { Controller, ForbiddenException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { I18n, I18nContext } from 'nestjs-i18n';
import { r } from '~contract';
import { Roles } from '~shared';
import { AdminService } from './admin.service';

@RoleCheck([Roles.ADMIN])
@Controller()
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@TsRestHandler(r.users.admin.listUsers)
	getUsers() {
		return tsRestHandler(r.users.admin.listUsers, async () => {
			const users = await this.adminService.getUsers();

			return {
				status: 200,
				body: users,
			};
		});
	}

	@TsRestHandler(r.users.admin.getUserForEdit)
	getUserForEdit() {
		return tsRestHandler(r.users.admin.getUserForEdit, async ({ query: { email } }) => {
			const { user, roles } = await this.adminService.getUserForEdit(email);

			if (!user) {
				return {
					status: 400,
					body: {
						message: `No user with email "${email}"!`,
					},
				};
			}

			return {
				status: 200,
				body: { user, roles },
			};
		});
	}

	@TsRestHandler(r.users.admin.editUser)
	editUser(@I18n() i18n: I18nContext) {
		return tsRestHandler(r.users.admin.editUser, async ({ body: { userRef, ...data } }) => {
			try {
				const editedUser = await this.adminService.editUser(userRef, data);

				return {
					status: 200,
					body: { user: editedUser },
				};
			} catch (error) {
				const message = getErrorMessage(error, i18n);

				return {
					status: 400,
					body: {
						message,
					},
				};
			}
		});
	}

	@TsRestHandler(r.users.admin.createUser)
	createUser(@AuthUser() user: LuciaUser, @Origin() origin: string) {
		return tsRestHandler(r.users.admin.createUser, async ({ body }) => {
			await this.adminService.createUser(body, { url: origin, user });

			return {
				status: 200,
				body: undefined,
			};
		});
	}

	@TsRestHandler(r.users.admin.deleteUser)
	deleteUser(@I18n() i18n: I18nContext) {
		return tsRestHandler(r.users.admin.deleteUser, async ({ body: { email } }) => {
			try {
				await this.adminService.deleteUser(email);

				return {
					status: 200,
					body: undefined,
				};
			} catch (error) {
				const message = getErrorMessage(error, i18n);

				throw new ForbiddenException(message);
			}
		});
	}

	@TsRestHandler(r.users.admin.resendInviteLink)
	resendInviteLink(@AuthUser() user: LuciaUser, @Origin() origin: string) {
		return tsRestHandler(r.users.admin.resendInviteLink, async ({ body: { email } }) => {
			const sendSuccess = await this.adminService.resendUserInviteLink(email, { url: origin, user });

			return {
				status: 200,
				body: sendSuccess,
			};
		});
	}
}
