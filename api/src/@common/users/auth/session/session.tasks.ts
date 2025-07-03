import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from './session.service';

@Injectable()
export class SessionTasks {
	private readonly logger = new Logger(SessionTasks.name);

	constructor(private readonly sessionService: SessionService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteExpiredSessions() {
		try {
			const { count } = await this.sessionService.deleteExpiredSessions();

			if (count) {
				this.logger.debug(`Expired sessions deleted successfully (${count} sessions removed).`);
			} else {
				this.logger.debug('No expired sessions deleted.');
			}
		} catch (error) {
			this.logger.error('Failed to delete expired sessions', error);
		}
	}
}
