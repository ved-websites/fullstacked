import { Role } from '$prisma-graphql/role';
import { User } from '$prisma-graphql/user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetUserOutput extends User {
	@Field(() => [Role], { nullable: false })
	override roles?: Array<Role>;
}
