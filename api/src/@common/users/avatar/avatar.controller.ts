import { BadRequestException, Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller(['users', 'avatars'])
export class AvatarController {
	constructor(private avatarService: AvatarService) {}

	@Get(':ref')
	async getUserAvatar(@Param('ref') ref: string) {
		try {
			const avatarFile = await this.avatarService.getImage(ref);

			return new StreamableFile(avatarFile);
		} catch (error) {
			throw new BadRequestException('Avatar does not exist!');
		}
	}
}
