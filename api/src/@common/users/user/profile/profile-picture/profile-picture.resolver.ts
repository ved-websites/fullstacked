import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/Upload.js';
import { UploadProfilePictureOutput } from './dto/upload-profile-picture.dto';
import { ProfilePictureService } from './profile-picture.service';

@Resolver()
export class ProfilePictureResolver {
	constructor(private profilePictureService: ProfilePictureService) {}

	@Mutation(() => UploadProfilePictureOutput)
	async uploadProfilePicture(
		@Args({ name: 'profilePicture', type: () => GraphQLUpload })
		file: FileUpload,
		@AuthSession() { user }: LuciaSession,
	) {
		const uploadedImage = await this.profilePictureService.uploadImage(file, user);

		return {
			fileName: uploadedImage.fileName,
		} satisfies UploadProfilePictureOutput;
	}

	@Mutation(() => Boolean)
	async deleteProfilePicture(@AuthSession() { user }: LuciaSession) {
		return this.profilePictureService.deleteUserImage(user);
	}
}
