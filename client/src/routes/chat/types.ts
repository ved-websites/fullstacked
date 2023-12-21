export type ChatMessageType = {
	id?: number;
	user: { email: string; name?: string };
	text: string;
	time: Date;
	active: boolean;
};
