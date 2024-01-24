import type { EventRouter } from '../ws-events';

export type ContractVariableName<T> = T extends `${infer P}Contract` ? P : never;

export function mapContractsToEndpoints<const T extends Record<string, unknown>>(contracts: T) {
	const automaticContracts = Object.keys(contracts).reduce(
		(prev, fullKey) => {
			const contractKey = fullKey.replace(/Contract$/, '');

			return {
				...prev,
				[contractKey]: (contracts as Record<string, unknown>)[fullKey],
			};
		},
		{} as {
			[K in ContractVariableName<keyof T>]: T[`${K}Contract`];
		},
	);

	return automaticContracts;
}

export type WsContractVariableName<T> = T extends `ws${infer P}Contract` ? Uncapitalize<P> : never;

export function mapWsContractsToEndpoints<const T extends EventRouter>(contracts: T) {
	const automaticContracts = Object.keys(contracts).reduce(
		(prev, fullKey) => {
			const contractKey = fullKey
				.replace(/^ws/, '')
				.replace(/Contract$/, '')
				.replace(/^./, (match) => match.toLowerCase());

			return {
				...prev,
				[contractKey]: (contracts as Record<string, unknown>)[fullKey],
			};
		},
		{} as {
			[K in WsContractVariableName<keyof T>]: T[`ws${Capitalize<K>}Contract`];
		},
	);

	return automaticContracts;
}
