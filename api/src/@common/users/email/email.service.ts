import { resolveRelativePath } from '$utils/callerFilePath';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { create as createHandlebars, type ExpressHandlebars } from 'express-handlebars';
import path from 'path';
import { firstValueFrom } from 'rxjs';
import { Environment, EnvironmentConfig } from '~/env.validation';
import * as helpers from './helpers';
import { SendMailData, sendEmailSchema } from './schemas';

type HbsRenderViewParameters = Parameters<ExpressHandlebars['renderView']>;

@Injectable()
export class EmailService {
	constructor(
		private readonly env: EnvironmentConfig,
		private readonly httpService: HttpService,
	) {}

	async render(viewPath: HbsRenderViewParameters[0], options: HbsRenderViewParameters[1] = {}, callerDepth: number = 1) {
		const hb = createHandlebars({
			extname: 'hbs',
			helpers,
			layoutsDir: path.resolve(__dirname, './layouts'),
			partialsDir: path.resolve(__dirname, './partials'),
		});

		const filePath = resolveRelativePath(viewPath, callerDepth);

		return hb.renderView(filePath, options);
	}

	async renderAndSend(render: Parameters<typeof this.render>, emailOptions: Omit<SendMailData, 'html'>) {
		const [viewPath, options] = render;

		const callerDepth = 2; // skipping this function call and service function

		const html = await this.render(viewPath, options, callerDepth);

		return this.send({
			html: html,
			...emailOptions,
		});
	}

	async send(emailOptions: SendMailData) {
		if (this.env.NODE_ENV == Environment.Development && !this.env.EMAIL_SENT_IN_DEV) {
			return null;
		}

		const data = await sendEmailSchema.parseAsync(emailOptions);

		const response = this.httpService.post(this.env.EMAIL_ENDPOINT, data, {
			headers: {
				Authorization: this.env.EMAIL_AUTH_KEY,
			},
		});

		return firstValueFrom(response);
	}
}
