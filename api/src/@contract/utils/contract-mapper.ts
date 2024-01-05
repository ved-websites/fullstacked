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
