import { AuthSession, LuciaSession } from '$auth/session.decorator';
import { SuccessOutput } from '$graphql/common-dto/success.dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/Upload.js';
import { AvatarService } from './avatar.service';
import { UploadAvatarOutput } from './dto/upload-avatar.dto';

@Resolver()
export class AvatarResolver {
	constructor(private avatarService: AvatarService) {}

	@Mutation(() => UploadAvatarOutput)
	async uploadAvatar(
		@Args({ name: 'avatar', type: () => GraphQLUpload })
		file: FileUpload,
		@AuthSession() { user }: LuciaSession,
	) {
		const uploadedImage = await this.avatarService.uploadImage(file, user);

		return {
			fileName: uploadedImage.fileName,
		} satisfies UploadAvatarOutput;
	}

	@Mutation(() => SuccessOutput, { nullable: true })
	async deleteAvatar(@AuthSession() { user }: LuciaSession) {
		await this.avatarService.deleteUserImage(user);

		return {
			success: true,
		} satisfies SuccessOutput;
	}
}
