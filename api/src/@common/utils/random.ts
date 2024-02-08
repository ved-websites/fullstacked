import { loadLuciaModule, loadOsloCryptoModule } from '$users/auth/lucia/modules-compat';

export const DEFAULT_RANDOM_STRING_LENGTH = 15;

export async function generateId(length = DEFAULT_RANDOM_STRING_LENGTH) {
	const { generateId } = await loadLuciaModule();

	return generateId(length);
}

export async function generateRandomSafeString(length = DEFAULT_RANDOM_STRING_LENGTH) {
	const { generateRandomString, alphabet } = await loadOsloCryptoModule();

	return generateRandomString(length, alphabet('a-z', 'A-Z', '0-9'));
}
