import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CanSendEmailOutput {
	@Field(() => Boolean, { description: 'Whether the connected user can send emails or not' })
	value!: boolean;
}
