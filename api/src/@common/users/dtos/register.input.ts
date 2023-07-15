import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
	@Field(() => String, { description: 'The register token provided in the registration link.' })
	registerToken!: string;

	@Field(() => String, { description: 'Password of the user' })
	password!: string;

	@Field(() => String, { nullable: true, description: 'First name of the user' })
	firstName?: string;

	@Field(() => String, { nullable: true, description: 'Last Name of the user' })
	lastName?: string;
}
