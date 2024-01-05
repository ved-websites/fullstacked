import { usersContract } from '../@common/users/users.contract';
import { messagesContract } from '../message/messages.contract';
import { c } from './utils/contract';
import { mapContractsToEndpoints } from './utils/contract-mapper';

const activeContracts = { messagesContract, usersContract };

export const routes = c.router(mapContractsToEndpoints(activeContracts), {
	strictStatusCodes: true,
});

/** Shorthand for {@link routes} */
export const r = routes;
