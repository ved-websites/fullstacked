import { BadRequestException, Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('avatars')
export class AvatarController {
	static readonly AVATAR_MAX_AGE_MINUTES = 15;

	constructor(private avatarService: AvatarService) {}

	@Get(':ref')
	@Header('Cache-Control', `max-age=${AvatarController.AVATAR_MAX_AGE_MINUTES * 60 * 1000}`)
	async getUserAvatar(@Param('ref') ref: string) {
		try {
			const avatarFile = await this.avatarService.getImage(ref);

			const extension = ref.substring(ref.lastIndexOf('.') + 1, ref.length);

			return new StreamableFile(avatarFile, {
				type: `image/${extension}`,
			});
		} catch (error) {
			throw new BadRequestException('Avatar does not exist!');
		}
	}
}
