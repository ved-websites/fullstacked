import { Public } from '$users/auth/auth.guard';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
	@Public()
	@Get()
	healthCheck() {
		return {
			status: 'ok',
			timestamp: Date.now(),
		};
	}
}
