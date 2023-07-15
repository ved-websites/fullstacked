import { Public } from '$auth/auth.guard';
import { AuthService } from '$auth/auth.service';
import { PrismaService } from '$prisma/prisma.service';
import { Body, Controller, Get, Next, Post, Redirect, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { OnboardingDto } from './onboarding.dto';

@Controller()
export class OnboardingController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
	) {}

	@Public()
	@Get()
	async onboarding(@Res() response: Response, @Next() next: NextFunction) {
		const userCount = await this.prisma.user.count();

		if (userCount !== 0) {
			next();
			return;
		}

		return response.render('onboarding', { layout: false });
	}

	@Public()
	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	@Redirect('/')
	async createInitialUser(@Next() next: NextFunction, @Body() onboardingDto: OnboardingDto) {
		const userCount = await this.prisma.user.count();

		if (userCount !== 0) {
			next();
			return;
		}

		const { firstName, lastName, email, password } = onboardingDto;

		await this.authService.createUser(email, password, { firstName, lastName });

		await this.prisma.role.upsert({
			create: {
				text: 'admin',
				users: {
					connect: {
						email,
					},
				},
			},
			update: {
				users: {
					connect: {
						email,
					},
				},
			},
			where: {
				text: 'admin',
			},
		});
	}
}
