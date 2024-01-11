import { usersContract } from '../@common/users/users.contract';
import { messagesContract, wsMessagesContract } from '../message/messages.contract';
import { c, wsC } from './utils/contract';
import { mapContractsToEndpoints, mapWsContractsToEndpoints } from './utils/contract-mapper';

// === IMPORT CUSTOM REST CONTRACTS BELOW ===
const activeRestContracts = {
	messagesContract,
	usersContract,
};
// === IMPORT CUSTOM REST CONTRACTS ABOVE ===

// === IMPORT CUSTOM EVENTS CONTRACTS BELOW ===
const activeEventsContracts = {
	wsMessagesContract,
};
// === IMPORT CUSTOM REST CONTRACTS ABOVE ===

export const routes = c.router(mapContractsToEndpoints(activeRestContracts), {
	strictStatusCodes: true,
});

/** Shorthand for {@link routes} */
export const r = routes;

export const wsEvents = wsC.masterRouter(mapWsContractsToEndpoints(activeEventsContracts));

/** Shorthand for {@link wsEvents} */
export const wsR = wsEvents;
