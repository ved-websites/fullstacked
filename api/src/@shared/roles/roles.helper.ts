export type RoleSpec = { name: string; sudo?: true; contains?: RoleSpec[] };

export type RawRoleSpec = string | { name: string; sudo: true } | { name: string; under?: string };

export function createRoles<T extends Record<string, RawRoleSpec>>(
	roleSpecs: T,
): T extends Record<infer K, unknown> ? Record<K, RoleSpec> : never {
	const specEntries = Object.entries(roleSpecs);

	const mappedRoleSpecs: Record<string, RoleSpec> = specEntries.reduce<Record<string, RoleSpec>>((acc, [key, rawSpec]) => {
		if (typeof rawSpec === 'string') {
			acc[key] = { name: rawSpec };

			return acc;
		}

		if ('sudo' in rawSpec) {
			acc[key] = rawSpec;

			return acc;
		}

		acc[key] = { name: rawSpec.name };

		return acc;
	}, {});

	for (let i = 0; i < specEntries.length; i++) {
		const [key, rawSpec] = specEntries[i]!;

		if (typeof rawSpec === 'string' || 'sudo' in rawSpec || rawSpec.under === undefined) {
			continue;
		}

		const refMappedSpec = mappedRoleSpecs[rawSpec.under];

		if (refMappedSpec) {
			if (!('sudo' in refMappedSpec)) {
				if (refMappedSpec.contains === undefined) {
					refMappedSpec.contains = [];
				}

				refMappedSpec.contains.push(mappedRoleSpecs[key]!);
			}
		}
	}

	return mappedRoleSpecs as T extends Record<infer K, unknown> ? Record<K, RoleSpec> : never;
}
