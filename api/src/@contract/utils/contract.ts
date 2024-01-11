import { initContract } from '@ts-rest/core';
import { createEventContract } from '../ws-events';

/** This is the TS-REST contract that is being initialized. */
export const contract = initContract();

/** Shorthand for {@link contract} */
export const c = contract;

export const wsContract = createEventContract();

/** Shorthand for {@link wsContract} */
export const wsC = wsContract;
