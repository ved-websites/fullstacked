import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadAvatarOutput {
	@Field(() => String, { description: 'file name of the uploaded avatar' })
	fileName!: string;
}
