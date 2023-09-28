import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserOutput {
	@HideField()
	id!: string;

	@Field(() => String, { description: 'Email of the created user' })
	email!: string;

	@Field(() => String, { description: 'Generated registerToken of the created user' })
	registerToken!: string;

	@Field(() => String, { nullable: true, description: 'First name of the user' })
	firstName?: string | null;

	@Field(() => String, { nullable: true, description: 'Last name of the user' })
	lastName?: string | null;
}
