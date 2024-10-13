import '$sentry/instrument';

import { setupApp } from '$app/setupApp';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});

	const port = setupApp(app);

	await app.listen(port);

	Logger.verbose(`Server launched on port ${port}!`);
}

bootstrap();
