export type ChatMessageType = {
	id?: string;
	user: { email: string; name?: string };
	text: string;
	time: Date;
	active: boolean;
};
