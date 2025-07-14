<script lang="ts">
	import { contextPublic } from '$lib/runes';
	import { Helper, type HelperProps } from 'flowbite-svelte';

	let {
		i18n: { t },
	} = contextPublic();

	type ZodArrayErrors = {
		_errors?: string[] | undefined;
	} & Record<number, unknown>;

	interface Props extends HelperProps {
		errors: string[] | ZodArrayErrors | undefined;
	}

	let { errors, ...rest }: Props = $props();

	let formattedErrors = $derived.by<string[]>(() => {
		if (!errors) {
			return [];
		}

		if (Array.isArray(errors)) {
			return errors;
		}

		// eslint-disable-next-line no-underscore-dangle
		return errors._errors ?? [];
	});
</script>

{#each formattedErrors as error}
	<Helper color="red" class="mt-1" {...rest}>
		{$t(error)}
	</Helper>
{/each}
