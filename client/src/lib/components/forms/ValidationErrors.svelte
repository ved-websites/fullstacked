<script lang="ts">
	import { getI18n } from '$i18n';
	import { Helper } from 'flowbite-svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	type ZodArrayErrors = {
		_errors?: string[] | undefined;
	} & Record<number, unknown>;

	export let errors: string[] | ZodArrayErrors | undefined;

	$: formattedErrors = ((): string[] => {
		if (!errors) {
			return [];
		}

		if (Array.isArray(errors)) {
			return errors;
		}

		// eslint-disable-next-line no-underscore-dangle
		return errors._errors ?? [];
	})();
</script>

{#each formattedErrors as error}
	<Helper color="red" class="mt-1" {...$$restProps}>
		{$t(error)}
	</Helper>
{/each}
