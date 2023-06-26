import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterOutput {
	@Field(() => String, { description: 'Generated accessToken of the user' })
	accessToken!: string;
}
