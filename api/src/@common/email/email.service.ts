import { getCallerFilePath } from '$utils/callerFilePath';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { create as createHandlebars, type ExpressHandlebars } from 'express-handlebars';
import path from 'path';
import { firstValueFrom } from 'rxjs';
import { Environment, EnvironmentConfig } from '~/env.validation';
import * as helpers from './helpers';
import { sendEmailSchema, SendMailData } from './schemas';

type HbsRenderViewParameters = Parameters<ExpressHandlebars['renderView']>;

@Injectable()
export class EmailService {
	constructor(
		private readonly env: EnvironmentConfig,
		private readonly httpService: HttpService,
	) {}

	async render(...args: [viewPath: HbsRenderViewParameters[0], options?: HbsRenderViewParameters[1], depth?: number]) {
		const hb = createHandlebars({
			extname: 'hbs',
			helpers,
			layoutsDir: path.resolve(__dirname, './layouts'),
			partialsDir: path.resolve(__dirname, './partials'),
		});

		const [viewPath, options = {}, callerDepth = 1] = args;

		const callerPath = getCallerFilePath(callerDepth);
		const directory = path.dirname(callerPath);
		const filePath = path.resolve(directory, viewPath);

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
		const data = await sendEmailSchema.parseAsync(emailOptions);

		if (this.env.NODE_ENV == Environment.Development && !this.env.EMAIL_SENT_IN_DEV) {
			return null;
		}

		const response = this.httpService.post(this.env.EMAIL_ENDPOINT, data, {
			headers: {
				Authorization: this.env.EMAIL_AUTH_KEY,
			},
		});

		return firstValueFrom(response);
	}
}
