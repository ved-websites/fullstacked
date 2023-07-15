import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';
import { resolve } from 'path';

export function setupViewEngine(app: NestExpressApplication) {
	app.engine(
		'hbs',
		engine({
			extname: 'hbs',
		}),
	);
	app.setViewEngine('hbs');
	app.setBaseViewsDir(resolve(__dirname, '../..', '@views'));
}
