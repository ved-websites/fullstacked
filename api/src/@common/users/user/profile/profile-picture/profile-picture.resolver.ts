import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
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
		@AuthUser() user: LuciaUser,
	) {
		const uploadedImage = await this.profilePictureService.uploadImage(file, user);

		return {
			fileName: uploadedImage.fileName,
		} satisfies UploadProfilePictureOutput;
	}

	@Mutation(() => Boolean)
	async deleteProfilePicture(@AuthUser() user: LuciaUser) {
		return this.profilePictureService.deleteUserImage(user);
	}
}
