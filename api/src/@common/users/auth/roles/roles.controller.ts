import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@TsRestHandler(r.roles.list)
	getRoles() {
		return tsRestHandler(r.roles.list, async () => {
			const roles = await this.rolesService.getRoles();

			return {
				status: 200,
				body: roles,
			};
		});
	}
}
