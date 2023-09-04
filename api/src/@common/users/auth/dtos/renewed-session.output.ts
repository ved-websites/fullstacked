import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RenewedSessionOutput {
	@Field(() => String, { description: 'Regenerated accessToken of the user' })
	accessToken!: string;
}
