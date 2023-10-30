import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordRequestOutput {
	@Field(() => String, { description: 'Token for password reset attempt' })
	token!: string;
}
