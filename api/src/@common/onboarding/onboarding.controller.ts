import { Public } from '$auth/auth.guard';
import { AuthService } from '$auth/auth.service';
import { PrismaService } from '$prisma/prisma.service';
import { Body, Controller, Get, Next, Post, Redirect, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { join } from 'path';
import type { OnboardingDto } from './onboarding.dto';

@Controller()
export class OnboardingController {
	constructor(private readonly prisma: PrismaService, private readonly auth: AuthService) {}

	@Public()
	@Get()
	async onboarding(@Res() response: Response, @Next() next: NextFunction) {
		const userCount = await this.prisma.user.count();

		if (userCount !== 0) {
			next();
			return;
		}

		response.sendFile(join(__dirname, 'onboarding.html'));
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

		await this.auth.register(email, password, { firstName, lastName });

		await this.prisma.role.create({
			data: {
				text: 'admin',
				users: {
					connect: {
						email,
					},
				},
			},
		});
	}
}
