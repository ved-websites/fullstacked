import { createEventDefinition } from '$events/event.definition';

export const PROFILE_PICTURE_UPLOAD_EVENT = createEventDefinition<{
	profilePictureRef?: string | null;
}>('profile-picture.upload');
