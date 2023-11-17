import { Role } from '$prisma-graphql/role';
import { LiveUser } from '$users/dtos/LiveUser.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetUserOutput extends LiveUser {
	@Field(() => [Role], { nullable: false })
	override roles?: Array<Role>;
}
