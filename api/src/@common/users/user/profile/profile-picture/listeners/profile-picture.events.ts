import { createEventDefinition } from '$events/event.definition';

export const PROFILE_PICTURE_EDIT_EVENT = createEventDefinition<{
	userEmail: string;
	oldProfilePictureRef: string | null;
	newProfilePictureRef: string | null;
}>('profile-picture.upload');
