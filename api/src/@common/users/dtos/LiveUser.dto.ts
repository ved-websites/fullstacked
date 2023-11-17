import { User } from '$prisma-graphql/user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LiveUser extends User {
	@Field(() => Boolean)
	online!: boolean;
}
