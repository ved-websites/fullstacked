import { Public } from '$users/auth/auth.guard';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
	@Public()
	@Get()
	home() {
		return 'This is the fullstacked API!';
	}
}
