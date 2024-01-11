import { setupViewEngine } from '$utils/setupViewEngine';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import cookieParser from 'cookie-parser';
import { EnvironmentConfig } from '~env';

export function setupApp(app: NestExpressApplication) {
	app.useWebSocketAdapter(new WsAdapter(app));

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	setupViewEngine(app);

	const env = app.get(EnvironmentConfig);

	const corsOrigins = env.CORS_LINKS;

	app.enableCors({ credentials: true, origin: corsOrigins ?? '*' });

	return env.PORT;
}
