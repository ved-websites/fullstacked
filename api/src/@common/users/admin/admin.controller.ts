import { getErrorMessage } from '$i18n/i18n.error';
import { Roles } from '$users/auth/roles/roles.guard';
import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { Origin } from '$utils/origin.decorator';
import { Controller, ForbiddenException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { I18n, I18nContext } from 'nestjs-i18n';
import { r } from '~contract';
import { ADMIN } from '~utils/roles';
import { AdminService } from './admin.service';

@Roles([ADMIN])
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

	@TsRestHandler(r.users.admin.listUsersGQL, {
		jsonQuery: true,
	})
	getUsersGql() {
		return tsRestHandler(r.users.admin.listUsersGQL, async (data) => {
			const users = await this.adminService.getUsersGql(data.query);

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
						message: 'No user with email!',
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
	editUser() {
		return tsRestHandler(r.users.admin.editUser, async ({ body: { userRef, ...data } }) => {
			const editedUser = await this.adminService.editUser(userRef, data);

			return {
				status: 200,
				body: { user: editedUser },
			};
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
}
