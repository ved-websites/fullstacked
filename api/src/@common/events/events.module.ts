import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service';

@Global()
@Module({
	imports: [
		EventEmitterModule.forRoot({
			global: true,
			verboseMemoryLeak: true,
		}),
	],
	providers: [EventsService],
	exports: [EventsService],
})
export class EventsModule {}
