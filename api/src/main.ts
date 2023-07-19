import { setupViewEngine } from '$utils/setupViewEngine';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvironmentConfig } from './env.validation';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	setupViewEngine(app);

	const env = app.get(EnvironmentConfig);

	const corsOrigins = env.CORS_LINKS;

	app.enableCors({ credentials: true, origin: corsOrigins ?? '*', allowedHeaders: 'Cookie, content-type' });

	const port = env.PORT;

	await app.listen(port);

	console.log(`Server launched on port ${port}!`);
}

bootstrap();
