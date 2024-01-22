import { Roles } from '$users/auth/roles/roles.guard';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
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
}
