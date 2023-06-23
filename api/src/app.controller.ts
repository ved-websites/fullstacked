import { Public } from '$auth/auth.guard';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Public()
	@Get()
	home() {
		return 'This is the fullstacked API! Make sure to use POST queries and target for /graphl endpoint to use graphql.';
	}
}
