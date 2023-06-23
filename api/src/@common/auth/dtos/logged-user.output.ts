import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedUserOutput {
	@Field(() => String, { description: 'Generated accessToken of the user' })
	accessToken!: string;
}
