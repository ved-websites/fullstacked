import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutOutput {
	@Field(() => Boolean, { description: 'if the user was logged out or not' })
	loggedOut!: boolean;
}
