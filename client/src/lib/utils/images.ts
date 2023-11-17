import { PUBLIC_API_ADDR } from '$env/static/public';

export function getProfilePictureImageUrl(profilePictureRef?: string | null) {
	if (!profilePictureRef) {
		return undefined;
	}

	if (profilePictureRef.startsWith('blob:')) {
		return profilePictureRef;
	}

	return `${PUBLIC_API_ADDR}/profile-pictures/${profilePictureRef}`;
}
