import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadProfilePictureOutput {
	@Field(() => String, { description: 'file name of the uploaded profile picture' })
	fileName!: string;
}
