import { setupViewEngine } from '$utils/setupViewEngine';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import cookieParser from 'cookie-parser';
import { Environment, EnvironmentConfig } from '~env';

export function setupApp(app: NestExpressApplication) {
	const env = app.get(EnvironmentConfig);

	const isProd = env.NODE_ENV === Environment.Production;

	if (isProd) {
		const logLevels: LogLevel[] = ['fatal', 'error', 'warn', 'verbose'];

		if (env.DEBUG) {
			logLevels.push('debug');
		}

		app.useLogger(logLevels);
	} else {
		app.flushLogs();
	}

	app.useWebSocketAdapter(new WsAdapter(app));

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	setupViewEngine(app);

	const corsOrigins = env.CORS_LINKS;

	app.enableCors({ credentials: true, origin: corsOrigins ?? '*' });

	return env.PORT;
}
