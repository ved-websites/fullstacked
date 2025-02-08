export interface EventDefinition<_DataType> {
	name: string;
}

export function createEventDefinition<T>(name: string): EventDefinition<T> {
	return { name };
}
