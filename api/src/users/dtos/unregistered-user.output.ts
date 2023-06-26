import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UnregisteredUserOutput {
	@Field(() => String, { description: 'Email of the unregistered user' })
	email!: string;

	@Field(() => String, { nullable: true, description: 'First name of the unregistered user' })
	firstName?: string;

	@Field(() => String, { nullable: true, description: 'Last name of the unregistered user' })
	lastName?: string;
}
