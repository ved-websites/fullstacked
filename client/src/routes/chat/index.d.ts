export type ChatMessage = {
	id?: string;
	user: { email: string; name?: string };
	text: string;
	time: string;
	active: boolean;
};
