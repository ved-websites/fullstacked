import { PUBLIC_API_ADDR } from '$env/static/public';

export function getProfilePictureImageUrl(profilePictureRef?: string | null) {
	if (!profilePictureRef) {
		return 'https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png';
	}

	if (profilePictureRef.startsWith('blob:')) {
		return profilePictureRef;
	}

	return `${PUBLIC_API_ADDR}/profile-pictures/${profilePictureRef}`;
}
