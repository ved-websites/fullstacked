import { Res } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import type { Response } from 'express';
import type { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => [])
	async login(@Res() response: Response) {
		const session = await this.authService.login('bla', 'bloo');

		response.locals.auth.setSession(session);
	}
}
