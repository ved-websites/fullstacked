import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
	@Field(() => String, { description: 'Email of the user' })
	email!: string;

	@Field(() => String, { description: 'Password of the user' })
	password!: string;
}
