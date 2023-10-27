import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';
import { ConfigOptions } from 'express-handlebars/types';
import { resolve } from 'path';
import * as helpers from '../email/helpers';

export function getHbsConfigs(config?: ConfigOptions): ConfigOptions {
	return {
		...config,
		extname: 'hbs',
		helpers: {
			...config?.helpers,
			...helpers,
		},
		layoutsDir: config?.layoutsDir || resolve(__dirname, '../email/layouts'),
		partialsDir: config?.partialsDir || resolve(__dirname, '../email/partials'),
	};
}

export function setupViewEngine(app: NestExpressApplication) {
	app.engine('hbs', engine(getHbsConfigs()));
	app.setViewEngine('hbs');
	app.setBaseViewsDir(resolve(__dirname, '../..', '@views'));
}
