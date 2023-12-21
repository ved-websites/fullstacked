import { usersContract } from '../@common/users/users.contract';
import { messagesContract } from '../message/messages.contract';
import { c } from './utils/contract';

export const routes = c.router(
	{
		messages: messagesContract,
		users: usersContract,
	},
	{
		strictStatusCodes: true,
	},
);

/** Shorthand for {@link routes} */
export const r = routes;
