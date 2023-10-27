import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
	@Field(() => String, { description: 'The token provided to reset the password' })
	token!: string;

	@Field(() => String, { description: 'Password of the user' })
	password!: string;
}
