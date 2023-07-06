import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvironmentConfig } from './env.validation';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const env = app.get(EnvironmentConfig);

	const corsOrigins = env.CORS_LINKS;

	app.enableCors({ credentials: true, origin: corsOrigins, methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'PATCH'] });

	const port = env.PORT;

	await app.listen(port);

	console.log(`Server launched on port ${port}!`);
}

bootstrap();
