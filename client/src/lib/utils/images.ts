import { PUBLIC_API_ADDR } from '$env/static/public';

export function getAvatarImageUrl(avatarRef?: string | null) {
	if (!avatarRef) {
		return 'https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png';
	}

	return `${PUBLIC_API_ADDR}/avatars/${avatarRef}`;
}
